window.addEventListener('DOMContentLoaded', () => {
  
    /* ========== NAVBAR START ========== */
    // sticky navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
      const value = window.scrollY;
      return value > 0 ? navbar.classList.add('active') : navbar.classList.remove('active');
    });
    
    // tombol hamburger navbar
    const navbarListGroup = document.querySelector('.navbar-list-group');
    const navbarButton = document.querySelector('#hamburger');
    navbarButton.addEventListener('click', () => {
      navbarListGroup.classList.toggle('active');
    });
    
    document.addEventListener('click', event => {
      if (!navbarButton.contains(event.target) && !navbar.contains(event.target)) {
        navbarListGroup.classList.remove('active');
      }
    });
    /* ========== NAVBAR END ========== */

    /* ========== SHOW ALL DATA PRODUCT START ========== */
    const cardContainer = document.querySelector('.card-container');
    
    function showAllDataProduct() {
      dataProduct.forEach(data => {
        const result = renderElementProduct(data);
        cardContainer.insertAdjacentHTML('afterbegin', result);
      });
    }
    
    showAllDataProduct();
    
    function renderElementProduct({image, name, price, description}) {
      return `
        <div class="card">
          <img src="images/${image}" alt="produk kami" class="card-image gambar-produk">
          <h4 class="nama-produk">${name}</h4>
          <h5 class="harga-produk">${price}</h5>
          <p>${description}</p>
          <button type="button" class="button button-cart">Add to cart</button>
        </div>
      `;
    }
    /* ========== SHOW ALL DATA PRODUCT END ========== */

    
    function setName(param) {
      // jika panjang karakter melebihi angka 20, maka batasi teks tersebut
      return param.length > 20 ? `${param.substring(0, 20)}...` : param;
    }
    
    function saveToLocalstorage() {
      /*
        parsing isi variabel "tasks" menjadi string JSON dengan fungsi JSON.stringify() lalu masukkan
        hasilnya kedalam localstorage dengan nama "shopping-cart"
      */
      localStorage.setItem('shopping-cart', JSON.stringify(tasks));
    }
    
    function showUI(data, index = 0) {
      // render isi parameter "data" menjadi element HTML
      const result = renderElementCart(data, index);
      // tampilkan element HTML
      boxContainer.insertAdjacentHTML('beforeend', result);
    }
    
    function renderElementCart({image, name, price}, index) {
      /*
        saya menggunakan plugin atau library fontawesome dibagian icon untuk menghapus data
        dikarenakan pada saat menggunakan feather-icon, icon tersebut tidak muncul
      */
      return `
        <div class="box">
          <div class="box-wrapper">
            <img src="${image}" alt="gambar produk" class="image">
            <div class="text-wrapper">
              <h4>${name}</h4>
              <span>${price}</span>
            </div>
          </div>
          <i class="fa-solid fa-trash-alt btn-delete" data-id="${index}"></i>
        </div>
      `;
    }
    
    function alerts(type, text) {
      // plugin / library sweetalert2
      swal.fire ({
        icon: type,
        title: 'Alert',
        text: text
      });
    }
    
    function loadData() {
      // bersihkan isi element "boxContainer"
      boxContainer.innerHTML = '';
      // ambil data yang ada di localstorage 
      const data = localStorage.getItem('shopping-cart');
      /*
        jika variabel "data" menghasilkan boolean true maka didalam localstorage ada data, jika didalam localstorage ada data
        maka parsing data tersebut menjadi JSON lalu ubah isi variabel "tasks" dengan data localstorage yang sudah diparsing.
        tapi jika tidak ada data, maka ubah isi variabel "tasks" dengan array kosong saja
      */
      tasks = (data) ? JSON.parse(data) : [];
      // looping variabel "tasks"
      tasks.forEach((task, index) => {
        // dapatkan semua data yang ada dan dapatkan juga index dari data tersebut
        showUI(task, index);
        // update total biaya yang harus dibayarkan
        updateTotalCost();
      });
    }
    
    // jalankan fungsi loadData() supaya ketika halaman sudah dimuat, data yang sudah di inputkan kedalam halaman keranjang akan tampil
    loadData();
    
    function updateTotalCost() {
      // ambil isi dari variabel "tasks" yang memiliki property dengan nama "price"
      // 0 adalah hasil default apabila tidak ada data yang bisa dijumlahkan
      const result = tasks.map(task => task.price).reduce((total, num) => total += num, 0); 
      // set isi variabel "result" kedalam element price
      price.textContent = result;
    }
    
    // event hapus data di keranjang belanja 
    window.addEventListener('click', event => {
      // jika element yang ditekan memiliki class "btn-delete"
      if (event.target.classList.contains('btn-delete')) {
        // ambil isi dari atribut "data-id" pada element yang ditekan
        const id = event.target.dataset.id;
        // jalankan fungsi deleteData()
        deleteData(id);
      }
    });
    
    function deleteData(index) {
      // plugin atau librsry dsri sweetalert2
      swal.fire ({
        icon: 'info',
        title: 'anda yakin?',
        text: 'anda yakin ingin menghapus list data ini?',
        showCancelButton: true
      })
      .then(response => {
        // jika menekan tombol ok atau yes
        if (response.isConfirmed) {
          // hapus element array di index yang sesuai dengan parameter "index"
          tasks.splice(index, 1);
          // simpan perubahan tersebut kedalam localstorage
          saveToLocalstorage();
          // beri pesan bahwa "data berhasil dihapus"
          alerts('success', 'data berhasil dihapus!');
          // update total biaya yang harus dibayarkan
          updateTotalCost();
          // load atau muat data yang ada didalam localstorage
          loadData();
        }
      });
    }
    /* ========== SHOPPING CART END ========== */
    
    
    /* ========== SEARCHING DATA START ========== */
    const productContainer = document.querySelector('.product-container');
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('keyup', function() {
      // value input pencarian produk
      const value = this.value.trim().toLowerCase();
      // jika input kosong, maka bersihkan isi element productContainer
      if (!value) return productContainer.innerHTML = '';
      // jalankan fungsi searchData()
      searchData(value);
    });
    
    function searchData(value) {
      // bersihkan isi element productContainer
      productContainer.innerHTML = '';
      // looping variabel "dataProduct"
      dataProduct.forEach(data => {
        /*
          jika ada nama produk atau harga produk yang sesuai dengan isi input pencarian produk
          maka tampilkan produk tersebut dan sembunyikan produk lainnya.
        */
        if (data.name.toLowerCase().indexOf(value) != -1 || data.price.toString().indexOf(value) != -1) {
          // render isi variabel "data" menjadi sebuah element HTML
          const result = renderData(data);
          // tampilkan dibagian bawah menu input pencarian produk 
          productContainer.appendChild(result);
        }
      });
    }
    
    function renderData({image, name, price}) {
      const box = create('div', 'box-product');
      
      const images = create('img', 'image');
      images.setAttribute('src', `images/${image}`);
      images.setAttribute('alt', 'gambar produk');
      
      const wrapper = create('div', 'text-wrapper');
      const h4 = create('h4', '', name, true);
      const span = create('span', '', price, true);
      
      wrapper.appendChild(h4);
      wrapper.appendChild(span);
      
      box.appendChild(images);
      box.appendChild(wrapper);
      
      return box;
    }
    
    function create(name, classname, value, show = false) {
      // buat element html sesuai isi parameter "name"
      const element = document.createElement(name);
      // berikan class pada element yang dibuay
      element.className = !classname ? '' : classname;
      // jika parameter "show" menghasilkan boolean true
      if (show == true) {
        // berikan teks atau value pada element yang dibuat
        element.textContent = value;
        // kembalikan nilai berupa element HTML dengan value
        return element;
      }
      // kembalikan nilai berupa element HTML tanpa value
      return element;
    }
    /* ========== SEARCHING DATA END ========== */
    
    // fitur shopping cart dibagian menu input pencarian produk
    window.addEventListener('click', event => {
      if (event.target.classList.contains('box-product')) {
        // tangkap isi dari gambar produk, nama produk dan harga produk
        const item = {
          image: event.target.querySelector('.image').src,
          name: setName(event.target.querySelector('h4').textContent),
          price: parseFloat(event.target.querySelector('span').textContent)
        };
        // jalankan fungsi addProductToCart()
        addProductToCart(item);
      }
    });
    
    // fitur checkout di halaman keranjang
    const btnCheckout = document.querySelector('.button-checkout');
    btnCheckout.addEventListener('click', function() {
      // jumlah barang
      const product = Array.from(boxContainer.children).length;
      // jika jumlah barang lebih besar dari angka 0 
      if (product > 0) {
        // plugin atau library dari "sweetalert2"
        const message = `jumlah barang yang anda beli adalah sebanyak ${product} barang. dan total biaya yang harus anda keluarkan adalah ${price.textContent}`;
        alerts('success', message);
        // hapus semua isi variabel "tasks"
        tasks = [];
        // simpan perubahan tersebut kedalam localstorage
        saveToLocalstorage();
        // update total biaya yang harus dibayarkan
        updateTotalCost();
        // load atau muat data yang ada didalam localstorage
        loadData();
      }
    });

    // tranding slider
    var trandingSlider = new Swiper('.tranding-slider',
    {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      loop: true,
      slidesPerView: 'auto',
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2.5,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextE1: '.swiper-button-next',
        prevE1: '.swiper-button-prev',
      }
    });
  });
  