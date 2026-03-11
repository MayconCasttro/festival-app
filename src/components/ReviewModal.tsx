// src/components/ReviewModal.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { getDistanceFromLatLonInMeters } from "@/lib/geo";
import { Camera, MapPin, Loader2, Star, CheckCircle } from "lucide-react";
import { auth, db, storage, isFirebaseConfigured } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  type UploadMetadata,
} from "firebase/storage";
import {
  signInWithPopup,
  signInAnonymously,
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
  const MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024;

  const compressImage = async (inputFile: File): Promise<Blob> => {
    if (!inputFile.type.startsWith("image/")) return inputFile;

    try {
      const bitmap = await createImageBitmap(inputFile);
      const maxSide = 1600;
      const scale = Math.min(
        1,
        maxSide / Math.max(bitmap.width, bitmap.height),
      );
      const width = Math.max(1, Math.round(bitmap.width * scale));
      const height = Math.max(1, Math.round(bitmap.height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return inputFile;

      // Resize before upload to avoid long transfers on slower networks.
      ctx.drawImage(bitmap, 0, 0, width, height);

      const outputType =
        inputFile.type === "image/png" ? "image/png" : "image/jpeg";
      const quality = outputType === "image/jpeg" ? 0.8 : undefined;

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (!result) {
              reject(new Error("Falha ao processar imagem"));
              return;
            }
            resolve(result);
          },
          outputType,
          quality,
        );
      });

      bitmap.close();
      return blob;
    } catch (error) {
      // Some mobile formats (e.g. HEIC) may fail decode in-browser; upload original file instead.
      console.warn(
        "Falha ao comprimir imagem, enviando arquivo original.",
        error,
      );
      return inputFile;
    }
  };

  const uploadResumableWithTimeout = async (
    uploadRef: ReturnType<typeof ref>,
    data: Blob,
    metadata: UploadMetadata,
    timeoutMs: number,
  ) => {
    const task = uploadBytesResumable(uploadRef, data, metadata);

    const uploadPromise = new Promise<typeof task.snapshot>(
      (resolve, reject) => {
        task.on(
          "state_changed",
          undefined,
          (error) => reject(error),
          () => resolve(task.snapshot),
        );
      },
    );

    return await withTimeout(
      uploadPromise,
      timeoutMs,
      "Upload da foto demorou demais. Verifique sua internet e tente novamente.",
    );
  };

  const withTimeout = async <T,>(
    promise: Promise<T>,
    ms: number,
    timeoutMessage: string,
  ): Promise<T> => {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        setTimeout(() => reject(new Error(timeoutMessage)), ms);
      }),
    ]);
  };

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

  const handleContinueAnonymous = async () => {
    setLoading(true);
    setError("");

    if (!isFirebaseConfigured || !auth) {
      setError(t("authNotConfigured"));
      setLoading(false);
      return;
    }

    try {
      const result = await signInAnonymously(auth);
      setUser(result.user);
      setStep("gps");
    } catch (error: any) {
      console.error("❌ Firebase Anonymous Auth Error:", error);
      if (error?.code === "auth/operation-not-allowed") {
        setError(
          "Login anônimo desativado no Firebase. Ative em Authentication > Sign-in method.",
        );
      } else {
        setError(
          `${t("loginError")} (${error?.code || "anonymous-auth-error"})`,
        );
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
      // Validate very large files before processing to avoid browser memory spikes.
      if (selected.size > MAX_IMAGE_SIZE_BYTES) {
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

      if (!user) {
        setError("Faça login para enviar foto.");
        setStep("auth");
        return;
      }

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
      const compressedImage = await compressImage(file);
      const ext = file.type.split("/")[1] || "jpg";
      const filename = `reviews/${user.uid}/review-${Date.now()}.${ext}`;
      const storageRef = ref(storage, filename);
      const metadata: UploadMetadata = {
        contentType:
          compressedImage.type ||
          (file.type === "image/png" ? "image/png" : "image/jpeg"),
        cacheControl: "public,max-age=3600",
      };

      const snapshot = await uploadResumableWithTimeout(
        storageRef,
        compressedImage,
        metadata,
        120000,
      );
      const photoUrl = await withTimeout(
        getDownloadURL(snapshot.ref),
        30000,
        "Não foi possível obter o link da foto.",
      );
      console.log("✅ Foto enviada com sucesso:", photoUrl);

      // B. Salva no Firestore (cliente)
      console.log("💾 Salvando avaliação no banco...");
      await withTimeout(
        addDoc(collection(db, "reviews"), {
          restaurantId,
          photoUrl,
          rating,
          comment,
          createdAt: serverTimestamp(),
          user: {
            uid: user.uid,
            name: user.displayName,
            avatar: user.photoURL,
          },
          userId: user.uid,
        }),
        15000,
        "Não foi possível salvar a avaliação.",
      );

      console.log("✅ Review salvo com sucesso");

      // Limpar preview URL para evitar vazamento de memória
      if (preview) {
        URL.revokeObjectURL(preview);
      }

      setStep("success");
    } catch (err: any) {
      console.error("❌ Erro completo ao enviar review:", err);
      const errorCode = err?.code as string | undefined;
      if (errorCode === "storage/unauthorized") {
        setError("Sem permissão no Storage. Verifique as regras do Firebase.");
      } else if (errorCode === "storage/retry-limit-exceeded") {
        setError(
          "Tempo limite do upload. Verifique bucket/configuração do Firebase Storage.",
        );
      } else if (errorCode === "storage/object-not-found") {
        setError("Bucket/objeto não encontrado no Firebase Storage.");
      } else if (errorCode === "storage/unknown") {
        setError(
          "Erro desconhecido no Storage. Confirme se o bucket existe no projeto Firebase.",
        );
      } else {
        const errorMsg = err?.message || err?.toString() || "Erro ao enviar";
        setError(errorMsg);
      }
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
            onClick={handleContinueAnonymous}
            disabled={loading}
            className="mt-4 text-sm text-gray-500 hover:underline disabled:opacity-50"
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
