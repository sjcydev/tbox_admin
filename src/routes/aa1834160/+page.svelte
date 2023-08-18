<script lang="ts">
  // import { validateUser } from '$lib/utils/form-checker';
  import axios from "axios";
  import { toast } from "@zerodevx/svelte-toast";

  let usuario = {
    nombre: "",
    apellido: "",
    username: "",
    correo: "",
    codigo: "",
    reset: function () {
      this.nombre = "";
      this.apellido = "";
      this.username = "";
      this.correo = "";
      this.codigo = "";
    },
  };

  let registering = false;
  async function crearUsuario(event: Event) {
    registering = true;
    axios
      .post("/api/auth/signup", { usuario })
      .then(({ data }) => {
        const { status, message } = data;
        toast.push(message, { classes: [status] });
        const form = event.target as HTMLFormElement;
        form.reset();
        usuario.reset();
        registering = false;
      })
      .catch(({ response }) => {
        registering = false;
        const { status, message } = response.data;
        toast.push(message, { classes: [status] });
      });
  }
</script>

<div class="hero min-h-screen bg-base-200">
  <div class="hero-content flex-col max-w-md lg:max-w-lg w-full">
    <form
      class="card flex-shrink-0 shadow-2xl w-full bg-base-100"
      method="POST"
      on:submit|preventDefault={(e) => crearUsuario(e)}
    >
      <div class="card-body">
        <h1
          class="text-2xl text-left font-medium tracking-wide
          text-neutral-focus"
        >
          Crear Usuario
        </h1>
        <div
          class="join join-vertical lg:join-horizontal gap-5 justify-between mt-4"
        >
          <div class="join-item form-control w-full">
            <input
              type="text"
              placeholder="Nombre"
              class="input input-bordered
        input-secondary w-full"
              bind:value={usuario.nombre}
              required
            />
          </div>
          <div class="join-item form-control w-full">
            <input
              type="text"
              placeholder="Apellido"
              class="input input-bordered
        input-secondary w-full"
              bind:value={usuario.apellido}
              required
            />
          </div>
        </div>
        <div class="form-control mt-3 lg:mt-4">
          <input
            type="text"
            placeholder="Username"
            class="input input-bordered
        input-secondary"
            bind:value={usuario.username}
            required
          />
        </div>
        <div class="form-control mt-3 lg:mt-4">
          <input
            type="text"
            placeholder="Correo"
            class="input input-bordered
        input-secondary"
            bind:value={usuario.correo}
            required
          />
        </div>
        <div class="form-control mt-3 lg:mt-4">
          <input
            type="password"
            placeholder="Codigo Secreto"
            class="input input-bordered
        input-secondary"
            bind:value={usuario.codigo}
            required
          />
        </div>
        <div class="form-control mt-6">
          <button type="submit" class="btn btn-secondary">
            {#if registering}
              <span class="loading loading-spinner loading-md" />
            {:else}
              Crear Usuario
            {/if}
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
