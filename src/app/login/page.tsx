import { LogInIcon } from 'lucide-react'
import Image from 'next/image'

export default async function LoginPage() {
  // const { userId } = await auth()
  // if (userId) {
  //   redirect('/')
  // }

  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-2">
      {/* ESQUERDA */}
      <div className="mx-auto flex h-full w-full max-w-[550px] flex-col justify-center p-4 sm:p-8">
        <Image
          src="/logo.svg"
          width={173}
          height={39}
          alt="Finance AI"
          className="mb-6 sm:mb-8"
          priority
        />
        <h1 className="mb-2 text-3xl font-bold sm:mb-3 sm:text-4xl">Bem-vindo</h1>
        <p className="mb-6 text-sm text-muted-foreground sm:mb-8 sm:text-base">
          A Finance AI é uma plataforma de gestão financeira que utiliza IA para monitorar suas
          movimentações, e oferecer insights personalizados, facilitando o controle do seu
          orçamento.
        </p>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:text-base"
        >
          <LogInIcon className="h-5 w-5" />
          Fazer login ou criar conta
        </button>
      </div>
      {/* DIREITA */}
      <div className="relative hidden h-full w-full overflow-hidden lg:block">
        <Image src="/login.png" alt="Faça login" fill className="object-cover" priority />
      </div>
    </div>
  )
}
