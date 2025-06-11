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

//메뉴 추가
const navUl = document.querySelector('#nav-menu');
const li = document.createElement('li');
li.classList.add('dropdown'); // 스타일용 클래스
const a = document.createElement('a');
a.textContent = 'APP';
a.href = '#'; // 클릭 시 이동 방지 또는 서브 메뉴 노출만
li.appendChild(a);	
// 드롭다운 ul 생성
const dropdownMenu = document.createElement('ul');
dropdownMenu.classList.add('dropdown-menu');
// 서브 메뉴 항목들
const subItems = [
  { name: 'iOS 앱', href: 'https://apps.apple.com/us/app/luvol-ps-300/id6740847686' },
  { name: 'Android 앱', href: 'https://play.google.com/store/apps/details?id=com.dynatone.app.blepiano&hl=ko&pli=1' }
];

subItems.forEach(item => {
  const subLi = document.createElement('li');
  const subA = document.createElement('a');
  subA.textContent = item.name;
  subA.href = item.href;
  subLi.appendChild(subA);
  dropdownMenu.appendChild(subLi);
});

li.appendChild(dropdownMenu);
navUl.appendChild(li);


    // 현재 페이지가 index.html일 때만 A/S 접수 메뉴 노출
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
