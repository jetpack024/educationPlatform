// const { template } = require("handlebars");


const toDate = (date) => new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
}).format(new Date(date));


document.querySelectorAll('.date').forEach((node) => {
  node.textContent = toDate(node.textContent);
});

const $card = document.querySelector('#card');
if ($card) {
  $card.addEventListener('click', (event) => {
    if (event.target.classList.contains('js-remove')) {
      const { id } = event.target.dataset;

      fetch(`/card/remove/${id}`, {
        method: 'delete',
      }).then((res) => res.json())
        .then((card) => {
          if (card.courses.length) {
            const html = card.courses.map((el) => `
              <tr>
              <td>${el.title}</td>
              <td>${el.count}</td>
              <td>
                <button class="btn btn-small js-remove" data-id="${el.id}">Удалить</button>
              </td>
            </tr>
              `).join('');

            $card.querySelector('tbody').innerHTML = html;
            $card.querySelector('.price').textContent = toCurrenscy(card.price);

          } else {
            $card.innerHTML = '<p>Корзина пуста</p>';
          }
        });
    }
  });
}

const div = document.getElementById('addingForm')
div.addEventListener('click', async(e) => {
  e.preventDefault();
  // const response = await fetch('')
  // const responseJSON = await response.json();
  const template = await fetch('hbs/user-edit.hbs');
  const hbsFromPublicText = await template.text();
  const myRender = await Handlebars.compile(hbsFromPublicText);
  div.innerHTML = myRender();
  $('input#addingForm, textarea#textarea2').characterCounter();
 






  // const hbsFromPublicText = await response.text();
  // const html = Handlebars.compile(hbsFromPublicText);
  // document.getElementById('addingForm').innerHTML = hbsFromPublicText;

})



M.Tabs.init(document.querySelectorAll('.tabs'));

//ЭТО СЛАЙДЕР:*
document.addEventListener('DOMContentLoaded', function() {
var elems = document.querySelectorAll('.slider');
  var instances = M.Slider.init(elems);
});
