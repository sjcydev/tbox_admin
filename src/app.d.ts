// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { PrismaClient } from "@prisma/client";

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      auth: import("lucia").AuthRequest;
    }
    // interface PageData {}
    // interface Platform {}
  }

  interface Registro {
    nombre: string;
    apellido: string;
    username: string;
    correo: string;
    telefono: string;
    codigo: string;
  }
  var prisma: PrismaClient;
  type Trackings = {
    numero_tracking: string;
    peso: number;
    base: number;
    precio: number;
    reset?: Function;
  };

  type Factura = {
    casillero: string | number;
    trackings: (Trackings & { promocion?: boolean })[];
    reset?: Function;
  };

  type Cliente = {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
  };

  type VerFacturas = {
    factura_id: number;
    casillero: number;
    cliente: Usuarios;
    fecha: string;
    pagado: boolean;
    total: number;
    trackings: Trackings[];
  };
}

/// <reference types="lucia" />
declare global {
  namespace Lucia {
    type Auth = import("$lib/server/lucia").Auth;
    type UserAttributes = {
      username: string;
      nombre: string;
      apellido: string;
      correo: string;
      password_updated: boolean;
    };
  }
}

export {};
