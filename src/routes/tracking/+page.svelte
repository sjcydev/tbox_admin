<script lang="ts">
  import axios from "axios";
  import Fa from "svelte-fa";
  import {
    faDownload,
    faCircleCheck,
    faCircleXmark,
  } from "@fortawesome/free-solid-svg-icons";
  import { createInvoice } from "$lib/utils/createpdf";
  import type { Facturas, Trackings, Usuarios } from "@prisma/client";

  type TrackingInterno = {
    factura: Facturas & { cliente: Usuarios; trackings: Trackings[] };
  } & Trackings;

  let search = "";

  let tracking: TrackingInterno;

  let timeout: ReturnType<typeof setTimeout>;

  let searching = false;
  function handleCasilleroChange() {
    clearTimeout(timeout);
    searching = true;
    timeout = setTimeout(async () => {
      if (search.length > 0) {
        await axios
          .get(`/api/trackings/${search}`)
          .then(({ data }) => (tracking = data.tracking));
      } else {
        tracking = <TrackingInterno>{};
      }
      searching = false;
    }, 500);
  }
</script>

<svelte:head>
  <title>Tracking Interno</title>
</svelte:head>

<div class="hero min-h-screen bg-base-200">
  <div class="hero-content flex-col w-full">
    <form
      class="card flex-shrink-0 shadow-2xl w-full bg-base-100"
      method="POST"
    >
      <div class="card-body">
        <h1 class="text-2xl text-left font-medium tracking-wide text-neutral">
          Tracking Interno
        </h1>
        <div class="form-control mt-3 lg:mt-4">
          <label for="tracking" class="label">
            <span class="label-text"
              >Tracking
              {#if searching}
                <span
                  class="loading loading-spinner loading-xs text-secondary"
                />
              {/if}
            </span>
          </label>
          <div class="join join-horizontal w-full">
            <input
              type="search"
              name="tracking"
              class="input input-bordered
        input-secondary join-item w-full"
              bind:value={search}
              required
              on:input={() => handleCasilleroChange()}
            />
            <button
              type="button"
              class="btn btn-secondary text-white join-item"
              on:click={() => handleCasilleroChange()}>Buscar</button
            >
          </div>
        </div>
        {#if tracking?.tracking_id}
          <table class="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Factura Nro.</th>
                <th>Casillero</th>
                <th>Cliente</th>
                <th>Numero de Tracking</th>
                <th class="text-right">Peso (lbs)</th>
                <th class="text-right">Precio Total</th>
                <th>Pagado</th>
                <th />
              </tr>
            </thead>
            <tbody class="text-black">
              <tr>
                <td>{tracking.factura.fecha}</td>
                <td>{tracking.factura.factura_id}</td>
                <th>{tracking.factura.cliente.casillero}</th>
                <td
                  >{tracking.factura.cliente.nombre}
                  {tracking.factura.cliente.apellido}</td
                >
                <td>{tracking.numero_tracking}</td>
                <td class="text-right">{tracking.peso}</td>
                <td class="text-right">${tracking.precio}</td>
                <td class="text-lg whitespace-nowrap w-1">
                  {#if tracking.factura.pagado}
                    <Fa class="text-green-500 mx-auto" icon={faCircleCheck} />
                  {:else}
                    <Fa class="text-red-500 mx-auto" icon={faCircleXmark} />
                  {/if}
                </td>
                <td class="text-right whitespace-nowrap w-1"
                  ><button
                    type="button"
                    on:click={() =>
                      createInvoice(
                        tracking.factura,
                        tracking.factura_id,
                        tracking.factura.cliente,
                        true
                      )}><Fa icon={faDownload} /></button
                  ></td
                >
              </tr>
            </tbody>
          </table>
        {/if}
      </div>
    </form>
  </div>
</div>
