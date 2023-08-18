<script lang="ts">
  import axios from "axios";
  import { toast } from "@zerodevx/svelte-toast";
  import type { Usuarios } from "@prisma/client";
  import { goto } from "$app/navigation";

  export let data: { usuario: Usuarios };
  let usuario = {
    id: data.usuario.id,
    nombre: data.usuario.nombre,
    apellido: data.usuario.apellido,
    correo: data.usuario.correo,
    telefono: data.usuario.telefono,
    casillero: data.usuario.casillero,
  };

  let registering = false;
  async function actulizarCasillero(event: Event) {
    registering = true;
    if (
      (typeof usuario.casillero === "string" && Number(usuario.casillero)) ||
      usuario.casillero === data.usuario.casillero
    ) {
      await axios
        .post(`/api/clientes/${usuario.id}`, { usuario })
        .then(({ data }) => {
          const { status, message } = data;
          toast.push(message, { classes: [status] });
          registering = false;
          goto("/");
        })
        .catch(({ response }) => {
          registering = false;
          const { status, message } = response.data;
          toast.push(message, { classes: [status] });
        });
    } else {
      toast.push("Casillero tiene que ser un numero");
      registering = false;
    }
  }
</script>

<form
  class="card flex-shrink-0 max-w-lg w-full shadow-2xl bg-base-100"
  method="POST"
  on:submit|preventDefault={(e) => actulizarCasillero(e)}
>
  <div class="card-body">
    <h1 class="text-2xl text-left font-medium tracking-wide">
      Actualizar Casillero
    </h1>
    <div class="form-control mt-3 lg:mt-4">
      <input
        type="text"
        placeholder="Casillero"
        class="input input-bordered
        input-primary"
        bind:value={usuario.casillero}
        required
      />
    </div>
    <div
      class="join join-vertical lg:join-horizontal gap-5 justify-between mt-4"
    >
      <div class="join-item form-control w-full">
        <input
          type="text"
          placeholder="Nombre"
          class="input input-bordered
        input-primary w-full"
          bind:value={usuario.nombre}
          required
        />
      </div>
      <div class="join-item form-control w-full">
        <input
          type="text"
          placeholder="Apellido"
          class="input input-bordered
        input-primary w-full"
          bind:value={usuario.apellido}
          required
        />
      </div>
    </div>
    <div class="form-control mt-3 lg:mt-4">
      <input
        type="email"
        placeholder="Correo"
        class="input input-bordered
        input-primary"
        bind:value={usuario.correo}
        required
      />
    </div>
    <div class="form-control mt-3 lg:mt-4">
      <input
        type="text"
        placeholder="Telefono"
        class="input input-bordered
        input-primary"
        bind:value={usuario.telefono}
        required
      />
    </div>
    <div class="form-control mt-6">
      <button type="submit" class="btn btn-primary">
        {#if registering}
          <span class="loading loading-spinner loading-md" />
        {:else}
          Actualizar Casillero
        {/if}
      </button>
    </div>
  </div>
</form>
