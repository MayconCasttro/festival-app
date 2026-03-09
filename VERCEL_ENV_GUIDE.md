# Guia: Corrigir Triângulos Amarelos no Vercel

## 🟡 O que significa o triângulo amarelo?

- **Variável não está sendo usada** no projeto
- **Formato inválido** da chave
- **Conflito** com outra variável

---

## ✅ Solução Passo a Passo

### **PASSO 1: Acessar Vercel Settings**

1. Vá para: https://vercel.com/dashboard/nucleo-gastronomicocd/settings/environment-variables
2. Procure pelas variáveis com triângulo amarelo

### **PASSO 2: Verificar cada variável**

As 6 variáveis **DEVEM ESTAR EXATAMENTE ASSIM**:

```
✅ NEXT_PUBLIC_FIREBASE_API_KEY
✅ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID
✅ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
✅ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
✅ NEXT_PUBLIC_FIREBASE_APP_ID
```

**Verificar:**

- ❌ Sem espaços no inicio/fim
- ❌ Sem caracteres especiais no nome
- ✅ Usar APENAS: `ABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789`

### **PASSO 3: Se ainda tiver triângulos**

Opção A - **Deletar e recriar:**

1. Clique no ícone de lixeira (🗑️) na variável com triângulo
2. Clique em **"Add Environment Variable"**
3. Digite o nome com cuidado (copie da lista acima)
4. Cole o valor
5. Clique **"Save"**

Opção B - **Verificar acentuação:**

- Em macOS, às vezes Keys ficam com acentuação invisível
- Solução: Delete e retype manualmente

### **PASSO 4: Após corrigir**

1. Salve as mudanças
2. Vercel automaticamente vai fazer o **redeploy**
3. Aguarde 1-2 minutos
4. Os triângulos devem desaparecer

---

## 🔍 Comandos para testar localmente

Para verificar se as variáveis estão corretas, rode:

```bash
npm run build
```

Se compilar sem erros, está tudo certo! ✅

---

## 💡 Se nada funcionar

1. Limpe o cache do Vercel:
   - Dashboard → Settings → Advanced → Clear Build Cache
2. Force um novo deploy:
   - Dashboard → Redeploy → Use existing Build Cache

3. Se persistir, contate: support@vercel.com
