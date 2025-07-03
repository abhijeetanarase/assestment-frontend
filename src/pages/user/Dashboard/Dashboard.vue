<template>
 <Hero/>
 <NewArrival/>
 
</template>

<script>
 
 import Hero from '../../../components/user/Hero.vue'
 import NewArrival from '../../../components/user/NewArrival.vue'

export default {
  name: 'UserDashboard',
  components: {
    Hero,
    NewArrival
      
    },
      
}
</script>