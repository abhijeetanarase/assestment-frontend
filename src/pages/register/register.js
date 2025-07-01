export default {
  name: 'RegisterForm',
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      },
      isSubmitting: false
    }
  },
  methods: {
    handleSubmit() {
      if (this.form.password !== this.form.confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      this.isSubmitting = true;
      
      // Simulate API call
      setTimeout(() => {
        console.log('Registration data:', this.form);
        this.isSubmitting = false;
        alert('Registration successful!');
        // Reset form
        this.form = {
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          agreeTerms: false
        };
      }, 1500);
    }
  },
  mounted() {
    // Initialize Lucide icons when component mounts
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}