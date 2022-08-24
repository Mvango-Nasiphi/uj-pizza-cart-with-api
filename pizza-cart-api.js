document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCartWithAPIWidget', function () {
        return {

            init() {
                axios
                    .get(`https://pizza-cart-api.herokuapp.com/api/pizzas`)
                    .then((result) => {
                        const pizzas = result.data.pizzas;
                        this.pizzas = pizzas;
                    })
                    .then(() => {
                        return this.createCart();
                    })
                    .then((result) => {
                        console.log(result.data);
                        this.cartId = result.data.cart_code;
                    })

            },
            createCart() {
                axios.get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/username/Nasiphi')
                    .then((result) => {
                        //this.cart = result.data;

                        const cartList = result.data;
                        cartList.find(item => {
                            if (item.status == 'open') {
                                console.log(item.status);
                                this.cartId = this.item.cart_code
                                return false
                            }

                        })
                        console.log(this.cartId)

                    });


                return axios.get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username' + this.username)
            },

            showCart() {
                const url = `https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartId}/get`;

                axios
                    .get(url)
                    .then((result) => {
                        this.cart = result.data;
                    });
            },

            pizzaImage(pizza) {
                return `./img/${pizza.size}.png`
            },




            message: '',
            username: 'Nasiphi',
            pizzas: [],
            cartId: '',
            cart: { total: 0 },
            featured: [],
            paymentAmount: null,
            paymentMessage: '',
            displayCart: false,
            showCheckout: true,
            showMessage: false,

            add(pizza) {

                const params = {
                    cart_code: this.cartId,
                    pizza_id: pizza.id
                }

                axios
                    .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', params)
                    .then(() => {
                        this.message = "Pizza added to cart"
                        this.showCart();
                    })
                    .catch(err => alert(err));

            },
            remove(pizza) {

                const params = {
                    cart_code: this.cartId,
                    pizza_id: pizza.id
                }

                axios
                    .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/remove', params)
                    .then(() => {
                        this.message = "Pizza removed from cart"
                        this.showCart();
                    })
                    .catch(err => alert(err));

            },

            featured() {
                axios
                    .get('https://pizza-cart-api.herokuapp.com/api/pizzas/featured')
                    .then((result) => {
                        this.featured = result.data.pizzas;
                    })
                    .then(() => {
                        Object.assign({}, this.featured);
                    })
            },

            pay(amount) {
                amount = this.paymentAmount;
                const params = {
                    cart_code: this.cartId,
                    amount: this.paymentAmount
                }

                axios
                    .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', params)
                    .then(() => {
                        if (!this.paymentAmount) {
                            this.paymentMessage = 'No amount entered';
                        }
                        else if (this.paymentAmount >= (this.cart.total)) {
                            this.paymentMessage = 'Enjoy  your pizzas';

                            setTimeout(() => {
                                this.cart.total = 0;
                                this.paymentMessege = '';
                                this.paymentAmount = 0;
                                this.message = '';
                                window.location.reload()
                            }, 3000);

                        }
                        else {
                            this.paymentMessage = 'Sorry, amount entered not enough'
                        }
                    })
                    //.then(() => {
                    //this.showCart();
                    // })
                    .catch(err => alert(err));
                //console.log(amount)
            },
        }
    });
})