import { SignInButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { LogInIcon } from 'lucide-react'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { Button } from '../_components/ui/button'

export default async function LoginPage() {
  const { userId } = await auth()
  if (userId) {
    redirect('/')
  }
  return (
    <div className="flex h-screen w-full flex-col lg:grid lg:grid-cols-2">
      {/* ESQUERDA */}
      <div className="flex h-full w-full flex-1 flex-col items-center justify-center p-8 lg:max-w-[550px]">
        <Image
          src="/logo.svg"
          width={173}
          height={39}
          alt="Finance AI"
          className="mb-8"
        />
        <h1 className="mb-3 text-center text-4xl font-bold lg:text-left">
          Bem-vindo
        </h1>
        <p className="mb-8 text-center text-muted-foreground lg:text-left">
          A Finance AI é uma plataforma de gestão financeira que utiliza IA para
          monitorar suas movimentações, e oferecer insights personalizados,
          facilitando o controle do seu orçamento.
        </p>
        <SignInButton>
          <Button variant="outline" className="w-full lg:w-auto">
            <LogInIcon className="mr-2" />
            Fazer login ou criar conta
          </Button>
        </SignInButton>
      </div>

      {/* DIREITA */}
      <div className="hidden h-full w-full lg:relative lg:flex">
        <Image
          src="/login.png"
          alt="Faça login"
          fill
          className="object-cover"
        />
      </div>
    </div>
  )
}
