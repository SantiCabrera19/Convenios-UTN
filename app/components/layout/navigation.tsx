"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileTextIcon, HomeIcon, ClockIcon, CheckCircleIcon, UserIcon, SettingsIcon, ShieldIcon } from "lucide-react";

interface NavigationProps {
  userRole?: string;
}

export function Navigation({ userRole }: NavigationProps) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const isAdmin = userRole === "admin";
  const isProfesor = userRole === "profesor";

  return (
    <>
      <nav className="flex-1 px-3 py-4 space-y-1">
        <Link 
          href="/protected" 
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive('/protected') 
              ? 'bg-primary/10 text-primary' 
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          }`}
        >
          <HomeIcon className="h-4 w-4" />
          Dashboard
        </Link>
        <Link 
          href="/protected/convenios-lista" 
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive('/protected/convenios-lista') 
              ? 'bg-primary/10 text-primary' 
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          }`}
        >
          <FileTextIcon className="h-4 w-4" />
          Convenios
        </Link>
        <Link 
          href="/protected/actividad" 
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive('/protected/actividad') 
              ? 'bg-primary/10 text-primary' 
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          }`}
        >
          <ClockIcon className="h-4 w-4" />
          Actividad
        </Link>
        <Link 
          href="/protected/aprobaciones" 
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive('/protected/aprobaciones') 
              ? 'bg-primary/10 text-primary' 
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          }`}
        >
          <CheckCircleIcon className="h-4 w-4" />
          Aprobaciones
        </Link>
      </nav>

      <div className="px-3 py-4 border-t">
        <div className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Administración
        </div>
        <nav className="space-y-1">
          {isAdmin && (
            <Link 
              href="/protected/admin" 
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/protected/admin') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <ShieldIcon className="h-4 w-4" />
              Panel Admin
            </Link>
          )}
          {isAdmin && (
            <Link 
              href="/protected/usuarios" 
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/protected/usuarios') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <UserIcon className="h-4 w-4" />
              Usuarios
            </Link>
          )}
          {isProfesor && (
            <Link 
              href="/protected/profesor" 
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/protected/profesor') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <UserIcon className="h-4 w-4" />
              Profesor
            </Link>
          )}
          {(isAdmin || isProfesor || userRole === "user") && (
            <Link 
              href="/protected/configuracion" 
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/protected/configuracion') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <SettingsIcon className="h-4 w-4" />
              Configuración
            </Link>
          )}
        </nav>
      </div>
    </>
  );
} 