function init() {
  const orders = document.getElementById("ordersList");
  orders.addEventListener('click', removeItem, true);
}

function removeItem(event) {
  const { target } = event;
  const id = target.getAttribute('data-order-id');

  let options = {
    method: 'DELETE',
  };

  if (id) {
    fetch(`api/order/${id}`, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Запрос завершился неуспешно: ${response.status} ${response.statusText}`);
        }
        const order = document.getElementById(id);
        if (document.body.contains(order)) {
          order.remove();
          location.reload();
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
}

document.addEventListener('DOMContentLoaded', init);
