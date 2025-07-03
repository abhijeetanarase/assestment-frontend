<template>
  <section class="relative bg-white overflow-hidden border-b border-gray-100">
    <div class="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative">
      <div class="flex flex-col lg:flex-row items-center gap-12">
        <!-- Content -->
        <div class="lg:w-1/2 text-center lg:text-left">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Upgrade Your <span class="text-indigo-600">Wardrobe</span>
          </h1>
          <p class="text-lg md:text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
            Discover the latest trends in clothing, shoes, and accessories for men & women. Shop new arrivals, bestsellers, and exclusive deals!
          </p>
       
          <!-- Features -->
          <div class="flex flex-wrap justify-center lg:justify-start items-center gap-6 text-sm text-gray-600 mb-6">
            <div class="flex items-center gap-2">
              <Truck class="w-5 h-5 text-indigo-500" />
              Free Shipping
            </div>
            <div class="flex items-center gap-2">
              <RefreshCcw class="w-5 h-5 text-green-500" />
              Easy Returns
            </div>
            <div class="flex items-center gap-2">
              <Headphones class="w-5 h-5 text-yellow-500" />
              24/7 Support
            </div>
          </div>
          <!-- Trust -->
          <div class="flex flex-wrap justify-center lg:justify-start items-center gap-6">
            <div class="flex items-center gap-2">
              <Star class="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span>4.9/5 Rating</span>
            </div>
            <div class="flex items-center gap-2">
              <User class="w-5 h-5 text-indigo-400" />
              <span>10,000+ Happy Shoppers</span>
            </div>
          </div>
        </div>
        <!-- Hero image -->
        <div class="lg:w-1/2 relative">
          <div class="relative max-w-md mx-auto lg:mx-0 lg:ml-auto">
            <img 
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80" 
              alt="Fashion collection" 
              class="rounded-xl shadow-2xl w-full h-auto object-cover"
            >
            <!-- Discount badge -->
            <div class="absolute -top-4 -right-4 bg-pink-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
              <span class="font-bold">Summer Sale 50% OFF</span>
            </div>
            <!-- Featured product card -->
            <div class="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100 max-w-xs">
              <div class="flex items-center gap-3">
                <div class="bg-indigo-100 p-2 rounded-lg">
                  <Shirt class="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">New Arrivals</h3>
                  <p class="text-sm text-gray-500">Trendy Styles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Shirt, Percent, Truck, RefreshCcw, Headphones, Star, User } from 'lucide-vue-next';

const scrollToProducts = (section) => {
  let id = 'products';
  if (section === 'men') id = 'men-products';
  if (section === 'women') id = 'women-products';
  if (section === 'sale') id = 'sale-products';
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};
</script>