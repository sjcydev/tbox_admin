<script lang="ts">
  import type { Usuarios } from "@prisma/client";
  import { createSearchStore, searchHandler } from "$lib/stores/search";
  import { onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import { paginate, LightPaginationNav } from "svelte-paginate";

  export let data: { usuarios: Usuarios[] };

  let pageSize = 25;
  let currentPage = 1;

  const searchUsuarios = data.usuarios.map((usuario: Usuarios) => ({
    ...usuario,
    searchTerm: `${usuario.id} ${usuario.nombre} ${usuario.apellido}
${usuario.cedula} ${usuario.telefono} ${usuario.correo}`,
  }));

  const searchStore = createSearchStore(searchUsuarios);

  $: paginatedItems = paginate({
    items: $searchStore.filtered,
    pageSize,
    currentPage,
  });

  const unsubscribe = searchStore.subscribe((model) => searchHandler(model));

  onDestroy(() => {
    unsubscribe();
  });
</script>

<svelte:head>
  <title>Clientes</title>
</svelte:head>

<div class="overflow-x-auto w-full h-full p-5 text-neutral-focus">
  <h1 class="text-2xl font-medium">Clientes</h1>

  <div class="my-3 w-full">
    <input
      class="input input-bordered input-secondary w-full"
      placeholder="Busqueda"
      bind:value={$searchStore.search}
      on:input={() => (currentPage = 1)}
    />
  </div>

  <LightPaginationNav
    totalItems={$searchStore.filtered.length}
    {pageSize}
    {currentPage}
    limit={1}
    showStepOptions={true}
    on:setPage={(e) => (currentPage = e.detail.page)}
  />

  <table class="table table-sm">
    <thead>
      <tr>
        <th>Casillero</th>
        <th>Nombre</th>
        <th>Correo</th>
        <th>Telefono</th>
        <th>Identificación</th>
        <th>Sexo</th>
      </tr>
    </thead>
    <tbody>
      {#each paginatedItems as usuario}
        <tr
          class="hover:bg-base-200 cursor-pointer"
          on:click={() => goto(`/clientes/${usuario.casillero}`)}
        >
          <th>{usuario.casillero}</th>
          <td>{usuario.nombre} {usuario.apellido}</td>
          <td>{usuario.correo}</td>
          <td>{usuario.telefono}</td>
          <td>{usuario.cedula}</td>
          <td>{usuario.sexo}</td>
        </tr>
      {/each}
    </tbody>
    <tfoot>
      <tr>
        <th>Casillero</th>
        <th>Nombre</th>
        <th>Correo</th>
        <th>Telefono</th>
        <th>Identificación</th>
        <th>Sexo</th>
      </tr>
    </tfoot>
  </table>
</div>

<style>
  :global(.pagination-nav) {
    box-shadow: none !important;
  }
</style>
