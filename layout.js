// header와 footer를 layout.html에서 불러와서 현재 페이지에 추가하는 스크립트
fetch('layout.html')
  .then(response => response.text())
  .then(html => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const header = tempDiv.querySelector('header');
    const footer = tempDiv.querySelector('footer');

    document.body.insertAdjacentElement('afterbegin', header);
    document.body.insertAdjacentElement('beforeend', footer);

    // 메뉴 추가
    const navUl = document.querySelector('#nav-menu');

    // PRODUCTS 메뉴 구성
    const productItems = [
      { name: 'RS-500', href: 'https://smartstore.naver.com/luvol/products/11923612272', target: '_blank' },
      { name: 'FS-500', href: 'https://smartstore.naver.com/luvol/products/11922764271', target: '_blank' },
      { name: 'PS-400', href: 'https://smartstore.naver.com/luvol/products/11923568558', target: '_blank' },
      { name: 'PS-300', href: 'https://smartstore.naver.com/luvol/products/11923586592', target: '_blank' },
      // { name: 'DR-500 (Coming Soon)', href: '', target: '_blank' },
    ];

    const productsLi = createDropdownMenu('PRODUCTS', productItems);
    navUl.appendChild(productsLi);

    // APP 메뉴 구성
    const appItems = [
      { name: 'iOS', href: 'https://apps.apple.com/us/app/luvol-ps-300/id6740847686', target: '_blank' },
      { name: 'Android', href: 'https://play.google.com/store/apps/details?id=com.dynatone.app.blepiano&hl=ko&pli=1', target: '_blank' },
      { name: 'Manual', href: 'https://docs.google.com/document/d/1AtAqDRWO__xG9rxMAx0T5E6209vjfiPqUIkd0xrJLO0', target: '_blank' },
    ];

    const appLi = createDropdownMenu('APP', appItems);
    navUl.appendChild(appLi);

    // A/S 접수 메뉴: as.html 페이지가 아닐 때만 표시
    const path = location.pathname;
    const isAS = path.includes('as.html');

    if (!isAS) {
      const asLi = document.createElement('li');
      const asA = document.createElement('a');
      asA.href = '/as.html';
      asA.textContent = 'A/S 접수';
      asLi.appendChild(asA);
      navUl.appendChild(asLi);
    }

    // 드롭다운 메뉴 토글 기능
    document.addEventListener('click', function (e) {
      const isDropdownToggle = e.target.closest('.dropdown > a');

      if (isDropdownToggle) {
        e.preventDefault();
        const dropdown = isDropdownToggle.parentElement;
        const menu = dropdown.querySelector('.dropdown-menu');
        const isOpen = menu.style.display === 'block';

        document.querySelectorAll('.dropdown-menu').forEach(m => {
          m.style.display = 'none';
        });

        menu.style.display = isOpen ? 'none' : 'block';
      } else {
        document.querySelectorAll('.dropdown-menu').forEach(m => {
          m.style.display = 'none';
        });
      }
    });

    // 공통 드롭다운 메뉴 생성 함수
    function createDropdownMenu(title, items) {
      const li = document.createElement('li');
      li.classList.add('dropdown');

      const a = document.createElement('a');
      a.textContent = title;
      a.href = '#';
      li.appendChild(a);

      const dropdownMenu = document.createElement('ul');
      dropdownMenu.classList.add('dropdown-menu');

      items.forEach(item => {
        const subLi = document.createElement('li');
        const subA = document.createElement('a');
        subA.textContent = item.name;
        subA.href = item.href;
        if (item.target) subA.target = item.target;
        subLi.appendChild(subA);
        dropdownMenu.appendChild(subLi);
      });

      li.appendChild(dropdownMenu);
      return li;
    }
  });
