<template>
  <div class="admin-products">
    <div class="px-4 sm:px-6 lg:px-8">
      <!-- Filters -->
      <ProductFilters
        v-if="showFilters"
        :categories="categories"
        :filters="filters"
        @update:filters="onFiltersUpdate"
      />
      

      <!-- Buttons -->
      <div class="sm:flex sm:items-center sm:justify-between">
        <div class="sm:flex-auto space-y-3">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Products</h1>
            <p class="mt-1 text-sm text-gray-600">
              Manage your product inventory and stock levels
            </p>
          </div>
          <div class="max-w-md">
            <div class="relative">
              <div
                class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
              >
                <svg
                  class="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                id="search"
                v-model="filters.search"
                @input="searchProducts"
                type="text"
                placeholder="Search products by name, SKU or category..."
                class="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:ring-opacity-50 hover:border-gray-400"
              />
            </div>
          </div>
        </div>

        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex gap-3">
         <button
    variant="secondary"
    @click="showFilters = !showFilters"
    class="group  border px-2 py-1 border-gray-500 rounded-md flex items-center gap-2"
  >
    <svg
      class="h-4 w-4 text-gray-500 group-hover:text-gray-700"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
      />
    </svg>
    {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
         </button>
          <BasicButton
            variant="primary"
            @click="goToAddProduct"
            class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
          >
            <svg
              class="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Product
          </BasicButton>
        </div>
      </div>

      <!-- Yellow Notice -->
      <div class="mt-8 mb-4">
        <div class="flex items-center bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <svg class="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"/></svg>
          <span class="text-sm text-yellow-800 font-medium">To display the product on the user side, the status of the product should be <span class="font-bold">Active</span>.</span>
        </div>
      </div>
      <div class="mt-8 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8"
          >
            <div
              class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
            >
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Product
                    </th>
                    <!-- Removed SKU column -->
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Stock
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Stock Status
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Out of Stock
                    </th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span class="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr
                    v-if="isLoading"
                    v-for="n in itemsPerPage"
                    :key="'skeleton-' + n"
                  >
                    <td v-for="i in 7" :key="i" class="px-3 py-4">
                      <div
                        class="h-4 bg-gray-200 rounded animate-pulse w-full"
                      ></div>
                    </td>
                  </tr>
                  <tr
                    v-else
                    v-for="product in products"
                    :key="product._id || product.id"
                  >
                    <td
                      class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6"
                    >
                      <div class="flex items-center">
                        <div class="h-10 w-10 flex-shrink-0">
                          <img
                            class="h-10 w-10 rounded-md object-cover bg-gray-100"
                            :src="
                              (
                                product.imageUrl ||
                                'https://via.placeholder.com/40x40?text=No+Image'
                              ).slice(0, 100)
                            "
                            :alt="product.name ? product.name.slice(0, 30) : ''"
                          />
                        </div>
                        <div class="ml-4">
                          <div class="font-medium text-gray-900">
                            {{ product.name ? product.name.slice(0, 30) : "" }}
                          </div>
                          <div class="text-gray-500">
                            {{
                              product.category
                                ? product.category.slice(0, 20)
                                : ""
                            }}
                          </div>
                          <div
                            class="text-xs text-gray-400 mt-1"
                            v-if="product.description"
                          >
                            {{ product.description.slice(0, 40) }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <!-- Removed SKU cell -->
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                    >
                      ${{
                        String(
                          Number(product.price).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        ).slice(0, 10)
                      }}
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                    >
                      {{ String(product.stock).slice(0, 6) }}
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                    >
                      <span
                        :class="[
                          product.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800',
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        ]"
                      >
                        {{ product.status ? product.status.slice(0, 1).toUpperCase()+ product.status.slice(1): "-" }}
                      </span>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm">
                      <span
                        :class="{
                          'bg-green-100 text-green-800':
                            product.stockStatus === 'High',
                          'bg-yellow-100 text-yellow-800':
                            product.stockStatus === 'Medium',
                          'bg-orange-100 text-orange-800':
                            product.stockStatus === 'Low',
                          'bg-red-100 text-red-800':
                            product.stockStatus === 'Out',
                        }"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        {{
                          product.stockStatus
                            ? product.stockStatus.slice(0, 10)
                            : "-"
                        }}
                      </span>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm">
                      <span
                        v-if="product.isOutOfStock"
                        class="bg-red-100 text-red-800 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        Yes
                      </span>
                      <span
                        v-else
                        class="bg-green-100 text-green-800 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        No
                      </span>
                    </td>
                    <td
                      class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                    >
                      <div class="flex flex-row items-center gap-2 justify-end">
                        <button
                          @click="editProduct(product)"
                          class="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Edit class="w-4 h-4" />
                        </button>
                        <button
                          @click="openDeleteModal(product)"
                          class="text-red-600 hover:text-red-900 flex items-center gap-1"
                        >
                          <Trash2 class="w-4 h-4" />
                        </button>
                         <button
                           @click="openStatusModal(product)"
                          class="text-green-600 hover:text-red-900 flex items-center gap-1"
                        >
                          <RefreshCcw class="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <PaginationComponent
          :current-page="currentPage"
          :total-items="total"
          :items-per-page="itemsPerPage"
          @update:page="handlePageChange"
        />
      </div>
    </div>

    <!-- Confirmation Modal for Delete -->
    <ConfirmationModal
      :isOpen="isDeleteModalOpen"
      title="Delete Product"
      message="Are you sure you want to delete this product? This action cannot be undone."
      confirmText="Delete"
      variant="danger"
      @confirm="confirmDeleteProduct"
      @cancel="isDeleteModalOpen = false"
    />

     <ConfirmationModal
      :isOpen="isStatusModalOpen"
      title="Change Product Status"
      message="Are you sure you want to change the status of this product?"
      confirmText="Change Status"
      variant="success"
      @confirm="confirmStatusUpdate"
      @cancel="isStatusModalOpen=false"
    />
  </div>
</template>

<script>
import BasicButton from "../../../components/BasicButton.vue";
import BasicModal from "../../../components/BasicModal.vue";
import BasicInput from "../../../components/BasicInput.vue";
import PaginationComponent from "../../../components/PaginationComponent.vue";
import ProductFilters from "../../../components/ProductFilters.vue";
import ConfirmationModal from "../../../components/ConfirmationModal.vue";
import api from "../../../utils/api";
import { Edit, Trash2 , RefreshCcw} from "lucide-vue-next";

export default {
  name: "AdminProducts",
  components: {
    BasicButton,
    BasicModal,
    BasicInput,
    PaginationComponent,
    ConfirmationModal,
    ProductFilters,
    Edit,
    Trash2,
    RefreshCcw
  },
  data() {
    return {
      isCreateProductModalOpen: false, // can be removed if not used elsewhere
      newProduct: {
        name: "",
        price: 0,
        stock: 0,
        status: "Published",
      },
      products: [],
      currentPage: 1,
      total: 0,
      itemsPerPage: 10,
      filters: {
        search: "",
        priceMin: "",
        priceMax: "",
        stockMin: "",
        stockMax: "",
        category: [],
        lowStock: false,
        medStock: false,
        highStock: false,
        outOfStock: false,
        status: '',
         sortBy: 'createdAt',
         order: 'desc',
      },
      isLoading: false,
      searchDebounceTimeout: null,
      isDeleteModalOpen: false,
      isStatusModalOpen: false,
      productToDelete: null,
      statusToUpdate: null, // For status update modal
      showFilters: false,
    };
  },
  methods: {
    async fetchProducts(page = 1) {
      this.isLoading = true;
      try {
        // Prepare category param: string if one, array if multiple, undefined if none
        let categoryParam = undefined;
        if (this.filters.category.length === 1) {
          categoryParam = this.filters.category[0];
        } else if (this.filters.category.length > 1) {
          categoryParam = this.filters.category;
        }
        const params = {
          page,
          limit: this.itemsPerPage,
          search: this.filters.search || undefined,
          priceMin: this.filters.priceMin || undefined,
          priceMax: this.filters.priceMax || undefined,
          stockMin: this.filters.stockMin || undefined,
          stockMax: this.filters.stockMax || undefined,
          category: categoryParam,
          lowStock: this.filters.lowStock ? "true" : undefined,
          outOfStock: this.filters.outOfStock ? "true" : undefined,
          medStock: this.filters.medStock ? "true" : undefined,
          highStock : this.filters.highStock ? "true" : undefined,
          status: this.filters.status || undefined,
        };
        const query = Object.entries(params)
          .filter(([k, v]) => v !== undefined && v !== "")
          .map(([k, v]) =>
            Array.isArray(v)
              ? v
                  .map(
                    (val) =>
                      `${encodeURIComponent(k)}=${encodeURIComponent(val)}`
                  )
                  .join("&")
              : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
          )
          .join("&");
        const res = await api.get(`/product?${query}`);
        if (Array.isArray(res.data.data)) {
          this.products = res.data.data;
        } else if (Array.isArray(res.data.products)) {
          this.products = res.data.products;
        } else if (Array.isArray(res.data)) {
          this.products = res.data;
        } else {
          this.products = [];
        }
        this.total = res.data.total || 0;
        this.currentPage = res.data.currentPage || page;
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        this.isLoading = false;
      }
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchProducts(page);
    },

    searchProducts() {
      clearTimeout(this.searchDebounceTimeout);
      this.searchDebounceTimeout = setTimeout(() => {
        this.currentPage = 1;
        this.fetchProducts(1);
      }, 500); // 500ms debounce
    },
    goToAddProduct() {
      this.$router.push("/admin/products/add-product");
    },
    editProduct(product) {
      // Implementation for editing a product
      this.$router.push(`/admin/products/edit-product/${product._id}`);
    },
    openDeleteModal(product) {
      this.productToDelete = product;
      this.isDeleteModalOpen = true;
    },
    openStatusModal(product) {
      this.statusToUpdate = product;
      this.isStatusModalOpen = true;
    },
   async confirmDeleteProduct() {
      if (this.productToDelete) {
        this.products = this.products.filter(
          (p) =>
            (p._id || p.id) !==
            (this.productToDelete._id || this.productToDelete.id)
        );
        try {
         const res =  await api.delete(`/product/delete/${this.productToDelete._id || this.productToDelete.id}`
        );
          console.log(res.data);
          
        } catch (error) {
           console.log(error);
           
        }
       
        console.log("Product deleted:", this.productToDelete);
        // Reset the reference after successful deletion
        this.productToDelete = null;
      }
      this.isDeleteModalOpen = false;
    },
    deleteProduct(product) {
      // No longer used directly, handled by modal
    },
   async confirmStatusUpdate() {
  if (this.statusToUpdate) {
    // Toggle status in UI
  

    try {
      // ✅ API call before clearing the reference
      const res = await api.put(`/product/status/${this.statusToUpdate._id}`);
      this.products = this.products.map((p) => {
      if ((p._id || p.id) === this.statusToUpdate._id) {
        return {
          ...p,
          status: p.status === "active" ? "inactive" : "active",
        };
      }
      return p;
    });
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
   
    // ✅ Now safe to reset
    this.statusToUpdate = null;
  }

  this.isStatusModalOpen = false;
}
,
    applyFilters() {
      this.currentPage = 1;
      this.fetchProducts(1);
    },
    resetFilters() {
      this.filters = {
        search: "",
        priceMin: "",
        priceMax: "",
        stockMin: "",
        stockMax: "",
        category: [],
        lowStock: false,
        outOfStock: false,
        medStock : false
      };
      this.currentPage = 1;
      this.fetchProducts(1);
    },
     onFiltersUpdate(newFilters) {
      this.filters = { ...this.filters, ...newFilters };
      this.applyFilters();
       
    },
    resetNewProduct() {
      this.newProduct = {
        name: "",
        price: 0,
        stock: 0,
        status: "Published",
      };
    },
  },
  mounted() {
    this.fetchProducts(this.currentPage);
  },

  
};
</script>

<style scoped>
/* ...existing code... */
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
</style>
