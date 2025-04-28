import Image from "next/image";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen max-h-screen flex-col lg:flex-row">
      {/* Fixed LHS with Logo */}
      <div className="hidden lg:flex w-1/2 bg-primary items-center justify-center p-10 overflow-hidden">
        <div className="relative w-60 h-20">
          <Image
            src="/logo-colored.svg"
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Scrollable RHS */}
      <div className="flex-1 flex flex-col px-4 py-6 bg-white overflow-y-auto">
        <div className="w-full max-w-md mx-auto flex flex-col flex-grow justify-center">
          {/* Mobile layout */}
          <div className="lg:hidden flex flex-col gap-12 pt-24 w-full">
            <div className="w-full">{children}</div>
          </div>

          {/* Desktop layout */}
          <div className="hidden lg:block w-full">{children}</div>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground mt-8 text-center">
          &copy; {new Date().getFullYear()} NomNom. All rights reserved.
        </p>
      </div>
    </main>
  );
};

export default AuthLayout;
