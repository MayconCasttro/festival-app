// src/components/ReviewModal.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { getDistanceFromLatLonInMeters } from "@/lib/geo";
import { Camera, MapPin, Loader2, Star, CheckCircle } from "lucide-react";
import { auth, db, storage, isFirebaseConfigured } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider, // Para Microsoft
  // O Discord não é um provedor direto, mas pode ser feito com OAuth genérico se necessário
  User,
} from "firebase/auth";
import LocalizedText from "./LocalizedText";
import { TRANSLATIONS } from "@/i18n/translations";

interface Props {
  restaurantId: string; // Adicionamos o ID para saber quem estamos avaliando
  restaurantLat: number;
  restaurantLng: number;
}

export default function ReviewModal({
  restaurantId,
  restaurantLat,
  restaurantLng,
}: Props) {
  // Estados de Fluxo
  const [step, setStep] = useState<
    "auth" | "gps" | "photo" | "form" | "success"
  >("auth");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);

  // Estados do Formulário
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // 0. Autenticação
  const t = (key: string) => {
    try {
      const lang = (localStorage.getItem("lang") ||
        "pt") as keyof typeof TRANSLATIONS;
      // @ts-ignore
      return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS["pt"]?.[key] ?? key;
    } catch (e) {
      // fallback
      // @ts-ignore
      return TRANSLATIONS["pt"]?.[key] ?? key;
    }
  };

  const handleSignIn = async (
    providerName: "google" | "github" | "microsoft" | "apple",
  ) => {
    setLoading(true);
    setError("");
    if (!isFirebaseConfigured || !auth) {
      setError(t("authNotConfigured"));
      setLoading(false);
      return;
    }
    let provider;

    switch (providerName) {
      case "google":
        provider = new GoogleAuthProvider();
        break;
      case "github":
        provider = new GithubAuthProvider();
        break;
      case "microsoft":
        provider = new OAuthProvider("microsoft.com");
        break;
      case "apple":
        provider = new OAuthProvider("apple.com");
        break;
      default:
        setLoading(false);
        return;
    }

    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setStep("gps");
    } catch (error: any) {
      console.error("❌ Firebase Auth Error:", {
        code: error?.code,
        message: error?.message,
        customData: error?.customData,
        email: error?.email,
      });

      // Melhor diagnóstico do erro
      if (error?.code === "auth/popup-blocked") {
        setError("Popup bloqueado. Permita janelas pop-up neste site.");
      } else if (error?.code === "auth/unauthorized-domain") {
        setError("Domínio não autorizado no Firebase. Contate o mantenedor.");
      } else if (
        error?.code === "auth/operation-not-supported-in-this-environment"
      ) {
        setError(
          "Autenticação não disponível neste ambiente. Tente outro navegador.",
        );
      } else if (error?.code === "auth/internal-error") {
        setError("Erro interno do Firebase. Verifique as credenciais.");
      } else {
        setError(`${t("loginError")} (${error?.code || "unknown"})`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 1. Verificar GPS
  const checkLocation = () => {
    setLoading(true);
    setError("");

    if (!navigator.geolocation) {
      setError(t("gpsNotSupported"));
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        try {
          if (process.env.NODE_ENV === "development") {
            console.log(
              "Sua localização:",
              pos.coords.latitude,
              pos.coords.longitude,
            );
          }
          const dist = getDistanceFromLatLonInMeters(
            pos.coords.latitude,
            pos.coords.longitude,
            restaurantLat,
            restaurantLng,
          );
          // Usando 1000m (1km) para facilitar seus testes. Em produção use 200m.
          if (dist <= 1000) {
            setStep("photo"); // Passa para a etapa da foto
          } else {
            setError(`Você está longe (${Math.round(dist)}m).`);
          }
        } catch (err) {
          setError("Coordenadas inválidas. Tente novamente.");
          console.error(err);
        }
        setLoading(false);
      },
      () => {
        setError(t("enableGps"));
        setLoading(false);
      },
      { enableHighAccuracy: true },
    );
  };

  // 2. Usuário selecionou a foto
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      // Validação: máximo 5MB
      if (selected.size > 5 * 1024 * 1024) {
        setError(t("imageTooLarge"));
        return;
      }
      // Validação: apenas imagens
      if (!selected.type.startsWith("image/")) {
        setError(t("invalidImage"));
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected)); // Cria preview local
      setStep("form"); // Passa para o formulário
    }
  };

  // 3. Enviar tudo para o Firebase
  const handleSubmit = async () => {
    if (!file) return;
    if (!comment.trim()) {
      setError("Por favor, escreva um comentário.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      console.log("🚀 Iniciando envio de review...");

      // Converter File para Base64
      console.log("📖 Convertendo arquivo para Base64...");
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          try {
            const result = reader.result as string;
            const base64 = result.split(",")[1]; // Remove "data:image/jpeg;base64,"
            if (!base64) {
              reject(new Error("Falha ao converter arquivo para Base64"));
              return;
            }
            resolve(base64);
          } catch (e) {
            reject(e);
          }
        };
        reader.onerror = (e) => {
          console.error("❌ Erro ao ler arquivo:", e);
          reject(new Error("Não foi possível ler o arquivo"));
        };
      });

      reader.readAsDataURL(file);
      const base64Data = await base64Promise;

      console.log(
        "✅ Arquivo convertido para Base64 (" + base64Data.length + " bytes)",
      );

      if (!storage) {
        setError("Storage indisponível");
        return;
      }

      if (!db) {
        setError("Banco de dados indisponível");
        return;
      }

      // A. Faz upload direto no Firebase Storage (cliente)
      console.log("📤 Enviando para Firebase Storage...");
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: file.type });

      const ext = file.type.split("/")[1] || "jpg";
      const filename = `reviews/review-${Date.now()}.${ext}`;
      const storageRef = ref(storage, filename);
      const snapshot = await uploadBytes(storageRef, blob, {
        contentType: file.type,
      });
      const photoUrl = await getDownloadURL(snapshot.ref);
      console.log("✅ Foto enviada com sucesso:", photoUrl);

      // B. Salva no Firestore (cliente)
      console.log("💾 Salvando avaliação no banco...");
      await addDoc(collection(db, "reviews"), {
        restaurantId,
        photoUrl,
        rating,
        comment,
        createdAt: serverTimestamp(),
        user: user
          ? {
              uid: user.uid,
              name: user.displayName,
              avatar: user.photoURL,
            }
          : null,
        userId: user ? user.uid : "user-anonimo",
      });

      console.log("✅ Review salvo com sucesso");

      // Limpar preview URL para evitar vazamento de memória
      if (preview) {
        URL.revokeObjectURL(preview);
      }

      setStep("success");
    } catch (err: any) {
      console.error("❌ Erro completo ao enviar review:", err);
      const errorMsg = err?.message || err?.toString() || "Erro ao enviar";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERIZAÇÃO ---

  if (step === "success") {
    return (
      <div className="p-6 bg-green-50 rounded-xl border border-green-200 text-center mt-6">
        <CheckCircle className="mx-auto text-green-600 mb-2" size={40} />
        <h3 className="font-bold text-green-800">
          <LocalizedText
            defaultText={TRANSLATIONS.pt.reviewSentTitle}
            translations={{
              pt: TRANSLATIONS.pt.reviewSentTitle,
              en: TRANSLATIONS.en.reviewSentTitle,
              es: TRANSLATIONS.es.reviewSentTitle,
              fr: TRANSLATIONS.fr.reviewSentTitle,
            }}
          />
        </h3>
        <p className="text-sm text-green-700">
          <LocalizedText
            defaultText={TRANSLATIONS.pt.reviewSentSub}
            translations={{
              pt: TRANSLATIONS.pt.reviewSentSub,
              en: TRANSLATIONS.en.reviewSentSub,
              es: TRANSLATIONS.es.reviewSentSub,
              fr: TRANSLATIONS.fr.reviewSentSub,
            }}
          />
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 bg-white rounded-xl shadow-lg border border-gray-100 mt-6">
      <h3 className="font-bold text-xl mb-1 text-gray-800">
        <LocalizedText
          defaultText={TRANSLATIONS.pt.rateDish}
          translations={{
            pt: TRANSLATIONS.pt.rateDish,
            en: TRANSLATIONS.en.rateDish,
            es: TRANSLATIONS.es.rateDish,
            fr: TRANSLATIONS.fr.rateDish,
          }}
        />
      </h3>

      {error && (
        <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded">
          {error}
        </p>
      )}

      {/* ETAPA 0: AUTH */}
      {step === "auth" && (
        <div className="text-center">
          <p className="mb-4 text-gray-600">
            <LocalizedText
              defaultText={TRANSLATIONS.pt.identifyPrompt}
              translations={{
                pt: TRANSLATIONS.pt.identifyPrompt,
                en: TRANSLATIONS.en.identifyPrompt,
                es: TRANSLATIONS.es.identifyPrompt,
                fr: TRANSLATIONS.fr.identifyPrompt,
              }}
            />
          </p>
          <div className="space-y-3">
            <button
              onClick={() => handleSignIn("google")}
              className="w-full bg-red-500 text-white py-2 rounded-lg"
            >
              <LocalizedText
                defaultText={TRANSLATIONS.pt.loginWithGoogle}
                translations={{
                  pt: TRANSLATIONS.pt.loginWithGoogle,
                  en: TRANSLATIONS.en.loginWithGoogle,
                  es: TRANSLATIONS.es.loginWithGoogle,
                  fr: TRANSLATIONS.fr.loginWithGoogle,
                }}
              />
            </button>
            <button
              onClick={() => handleSignIn("apple")}
              className="w-full bg-black text-white py-2 rounded-lg"
            >
              <LocalizedText
                defaultText={TRANSLATIONS.pt.loginWithApple}
                translations={{
                  pt: TRANSLATIONS.pt.loginWithApple,
                  en: TRANSLATIONS.en.loginWithApple,
                  es: TRANSLATIONS.es.loginWithApple,
                  fr: TRANSLATIONS.fr.loginWithApple,
                }}
              />
            </button>
          </div>
          <button
            onClick={() => setStep("gps")}
            className="mt-4 text-sm text-gray-500 hover:underline"
          >
            <LocalizedText
              defaultText={TRANSLATIONS.pt.continueAnonymous}
              translations={{
                pt: TRANSLATIONS.pt.continueAnonymous,
                en: TRANSLATIONS.en.continueAnonymous,
                es: TRANSLATIONS.es.continueAnonymous,
                fr: TRANSLATIONS.fr.continueAnonymous,
              }}
            />
          </button>
        </div>
      )}

      {/* ETAPA 1: GPS */}
      {step === "gps" && (
        <button
          onClick={checkLocation}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white font-medium px-4 py-3 rounded-lg w-full justify-center"
        >
          {loading ? <Loader2 className="animate-spin" /> : <MapPin />}
          <LocalizedText
            defaultText={TRANSLATIONS.pt.validateLocation}
            translations={{
              pt: TRANSLATIONS.pt.validateLocation,
              en: TRANSLATIONS.en.validateLocation,
              es: TRANSLATIONS.es.validateLocation,
              fr: TRANSLATIONS.fr.validateLocation,
            }}
          />
        </button>
      )}

      {/* ETAPA 2: FOTO */}
      {step === "photo" && (
        <label className="flex items-center gap-2 bg-orange-500 text-white font-medium px-4 py-3 rounded-lg w-full justify-center cursor-pointer">
          <Camera />{" "}
          <LocalizedText
            defaultText={TRANSLATIONS.pt.takePhoto}
            translations={{
              pt: TRANSLATIONS.pt.takePhoto,
              en: TRANSLATIONS.en.takePhoto,
              es: TRANSLATIONS.es.takePhoto,
              fr: TRANSLATIONS.fr.takePhoto,
            }}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>
      )}

      {/* ETAPA 3: FORMULÁRIO */}
      {step === "form" && (
        <div className="animate-in fade-in">
          {/* Preview da foto */}
          <div className="relative w-full h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden">
            <Image src={preview} alt="Preview" fill className="object-cover" />
          </div>

          {/* Estrelas */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setRating(star)} type="button">
                <Star
                  size={32}
                  className={
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              </button>
            ))}
          </div>

          {/* Comentário */}
          <textarea
            placeholder={TRANSLATIONS.pt.commentPlaceholder}
            className="w-full border p-3 rounded-lg mb-4 text-sm text-black"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg"
          >
            {loading ? (
              <LocalizedText
                defaultText={TRANSLATIONS.pt.sending}
                translations={{
                  pt: TRANSLATIONS.pt.sending,
                  en: TRANSLATIONS.en.sending,
                  es: TRANSLATIONS.es.sending,
                  fr: TRANSLATIONS.fr.sending,
                }}
              />
            ) : (
              <LocalizedText
                defaultText={TRANSLATIONS.pt.confirmReview}
                translations={{
                  pt: TRANSLATIONS.pt.confirmReview,
                  en: TRANSLATIONS.en.confirmReview,
                  es: TRANSLATIONS.es.confirmReview,
                  fr: TRANSLATIONS.fr.confirmReview,
                }}
              />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
