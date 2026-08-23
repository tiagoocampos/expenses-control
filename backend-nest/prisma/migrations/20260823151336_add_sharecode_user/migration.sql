-- AlterTable: adiciona a coluna como opcional primeiro
ALTER TABLE "users" ADD COLUMN "share_code" TEXT;

-- Preenche os registros existentes com um código aleatório de 8 caracteres
UPDATE "users" SET "share_code" = upper(substr(md5(random()::text || id::text), 1, 8));

-- Agora torna obrigatória
ALTER TABLE "users" ALTER COLUMN "share_code" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_share_code_key" ON "users"("share_code");