fetch('layout.html')
  .then(response => response.text())
  .then(html => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const header = tempDiv.querySelector('header');
    const footer = tempDiv.querySelector('footer');

    document.body.insertAdjacentElement('afterbegin', header);
    document.body.insertAdjacentElement('beforeend', footer);

    // 현재 페이지가 index.html일 때만 A/S 접수 메뉴 추가
    const isIndex = location.pathname.endsWith('index.html') || location.pathname === '/' || location.pathname === '';
    if (isIndex) {
      const navUl = document.querySelector('#nav-menu');
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '/as.html';
      a.textContent = 'A/S 접수';
      li.appendChild(a);
      navUl.appendChild(li);
    }
  });
