<script lang="ts">
  import axios from "axios";
  import { toast } from "@zerodevx/svelte-toast";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  toast.push(
    "La contraseña creada anteriormente era temporal. Porfavor actualizar la contraseña.",
    { classes: ["warning"] }
  );

  let password = "";
  let confirmed = "";

  let loading = false;
  async function iniciarUsuario(event: Event) {
    loading = true;
    if (password === confirmed) {
      axios
        .post("/api/auth/update_password", {
          username: $page.data.username,
          password,
          userID: $page.data.userID,
        })
        .then(({ data }) => {
          const { status, message } = data;
          toast.push(message, { classes: [status] });

          const form = event.target as HTMLFormElement;
          form.reset();

          password = "";
          confirmed = "";

          loading = false;
          goto("/");
        })
        .catch(({ response }) => {
          loading = false;
          const { status, message } = response.data;
          toast.push(message, { classes: [status] });
        });
    } else {
      toast.push("Contraseñas no coinciden", { classes: ["warning"] });
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Actualizar Contraseña</title>
</svelte:head>

<div class="hero min-h-screen bg-base-200">
  <div class="hero-content w-full max-w-sm flex-col">
    <form
      class="card flex-shrink-0 w-full shadow-2xl bg-base-100"
      method="POST"
      on:submit|preventDefault={(e) => iniciarUsuario(e)}
    >
      <div class="card-body">
        <h1
          class="text-2xl text-left font-medium tracking-wide text-neutral-focus"
        >
          Actualizar Contraseña
        </h1>
        <div class="form-control mt-3 lg:mt-4">
          <input
            type="password"
            placeholder="Nueva Contraseña"
            class="input input-bordered
        input-secondary"
            bind:value={password}
            required
          />
        </div>
        <div class="form-control mt-3 lg:mt-4">
          <input
            type="password"
            placeholder="Confirmar Contraseña"
            class="input input-bordered
        input-secondary"
            bind:value={confirmed}
            required
          />
        </div>
        <div class="form-control mt-6">
          <button type="submit" class="btn btn-secondary">
            {#if loading}
              <span class="loading loading-spinner loading-md" />
            {:else}
              Actualizar
            {/if}
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
