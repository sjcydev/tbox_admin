<script lang="ts">
  import axios from "axios";
  import { toast } from "@zerodevx/svelte-toast";
  import { goto } from "$app/navigation";

  let username = "";
  let password = "";

  let loading = false;
  async function iniciarUsuario(event: Event) {
    loading = true;
    axios
      .post("/api/auth/login", { username, password })
      .then(({ data }) => {
        goto("/");
        const { status, message } = data;
        toast.push(message, { classes: [status] });

        const form = event.target as HTMLFormElement;
        form.reset();

        username = "";
        password = "";

        loading = false;
      })
      .catch(({ response }) => {
        loading = false;
        const { status, message } = response.data;
        toast.push(message, { classes: [status] });
      });
  }
</script>

<svelte:head>
  <title>Iniciar Sesión</title>
</svelte:head>

<div class="hero min-h-screen bg-base-200">
  <div class="hero-content w-full max-w-sm">
    <form
      class="card flex-shrink-0 w-full shadow-2xl bg-base-100"
      method="POST"
      on:submit|preventDefault={(e) => iniciarUsuario(e)}
    >
      <div class="card-body">
        <h1
          class="text-2xl text-left font-medium tracking-wide text-neutral-focus"
        >
          Iniciar Sesión
        </h1>
        <div class="form-control mt-3 lg:mt-4">
          <input
            type="text"
            placeholder="Nombre de Usuario"
            class="input input-bordered
        input-secondary"
            bind:value={username}
            required
          />
        </div>
        <div class="form-control mt-3 lg:mt-4">
          <input
            type="password"
            placeholder="Contraseña"
            class="input input-bordered
        input-secondary"
            bind:value={password}
            required
          />
        </div>
        <div class="form-control mt-6">
          <button type="submit" class="btn btn-secondary">
            {#if loading}
              <span class="loading loading-spinner loading-md" />
            {:else}
              Iniciar
            {/if}
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
