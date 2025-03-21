import { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Inscription | ProComptable",
  description: "Créez votre compte ProComptable",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
              Créer un compte
            </h1>
            <p className="text-sm text-gray-600">
              Rejoignez ProComptable et commencez à gérer votre comptabilité efficacement
            </p>
          </div>
          
          <div className="backdrop-blur-lg bg-white/30 p-8 rounded-2xl shadow-xl ring-1 ring-gray-900/5">
            <RegisterForm />
          </div>
        </div>
      </div>

      {/* Right side - Features */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative max-w-2xl mx-auto px-8 text-white">
          <h2 className="text-3xl font-bold mb-8">Pourquoi choisir ProComptable ?</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <svg className="h-6 w-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-semibold mb-1">Gestion simplifiée</h3>
                <p className="text-white/80">Interface intuitive pour gérer votre comptabilité sans effort</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="h-6 w-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <h3 className="font-semibold mb-1">Sécurité maximale</h3>
                <p className="text-white/80">Vos données sont protégées avec les dernières technologies de sécurité</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="h-6 w-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div>
                <h3 className="font-semibold mb-1">Performance optimale</h3>
                <p className="text-white/80">Accédez rapidement à toutes vos informations comptables</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 