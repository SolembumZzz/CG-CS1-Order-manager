class Order {
    constructor(orderID, date, status, customer, email, tel, location) {
        this.orderID = orderID;
        this.date = date;
        this.status = status;
        this.customer = customer;
        this.email = email;
        this.tel = tel;
        this.location = location;
    }
}

var orders = [];

const orderData = "orderData";

function init() {
    if (getLocalStorage(orderData) == null) {
        orders = [
            new Order(1, "Jul-20-2022", "Pending", "Han Nguyen", "hannguyen7796@gmail.com", "0924018513", "Da Nang"),
            new Order(2, "Feb-20-2022", "Canceled", "Phuong Thao", "phuong@gmail.com", "0935670606", "Hue"),
            new Order(3, "Jul-21-2022", "Dispatched", "Nhan Nguyen", "Nhan@gmail.com", "0915438794", "Ho Chi Minh"),
            new Order(4, "Mar-12-2022", "Suspended", "Uyen Phuong", "Uyen@gmail.com", "0915770407", "Ha Noi")
        ]
        setLocalStorage(orderData, orders);
    }
    else {
        orders = getLocalStorage(orderData);
    }
}

function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

function renderOrders() {
    let htmls = orders.map(function (order) {
        return `
            <tr>
                <td><input type="checkbox" name="checkOrder" id="checkbox_${order.orderID}"></td>
                <td>${order.orderID}</td>
                <td>${order.date}</td>
                <td id="status_${order.orderID}">${order.status}</td>
                <td id="customer_${order.orderID}">${order.customer}</td>
                <td id="email_${order.orderID}">${order.email}</td>
                <td id="tel_${order.orderID}">${order.tel}</td>
                <td id="location_${order.orderID}">${order.location}</td>
                <td class="btn-modify">
                    <i class="fas fa-cog" id="openMenu_${order.orderID}"></i>
                        <ul class="order-menu" id="orderMenu_${order.orderID}">
                            <li id="editOrder_${order.orderID}" onclick="editOrder(${order.orderID})"><i class="fas fa-pen-nib"></i>Edit</li>
                            <li id="removeOrder_${order.orderID}" onclick="removeOrder(${order.orderID})"><i class="fa fa-trash"></i>Remove</li>
                        </ul>
                        <i title="Save" class="fas fa-save d-none" onclick="saveEdit(${order.orderID})" id="saveEdit_${order.orderID}"></i>
                        <i title="Reset" class="fas fa-times d-none" onclick="resetField(${order.orderID})" id="resetField_${order.orderID}"></i>
                </td>
            </tr>`
    })
    document.getElementById('orderList').innerHTML = htmls.join('');
}

function submitNew() {
    let currentID = findMaxID() + 1;
    let date = document.getElementById('inputDate').value;
    let status = document.getElementById('inputStatus').value;
    let customer = document.getElementById('inputCustomer').value;
    let email = document.getElementById('inputEmail').value;
    let tel = document.getElementById('inputTel').value;
    let location = document.getElementById('inputLocation').value;

    let valid = checkValidity(date, customer, tel, location);

    if (valid) {
        orders.push(new Order(currentID, date, status, customer, email, tel, location));

        setLocalStorage(orderData, orders)
        renderOrders();
        clearForm();
    }
}


function checkValidity(date, customer, tel, location) {
    let theFollowing = [];
    if (date == '' || customer == '' || tel == '' || location == '') {
        if (date == '') {
            theFollowing.push("order date");
        }
        if (customer == '') {
            theFollowing.push("customer's name");
        }
        if (tel == '') {
            theFollowing.push("telephone number");
        }
        if (location == '') {
            theFollowing.push("customer's location");
        }
        alert(`WARNING!!! The following fields are empty: ${theFollowing.join(', ')}`)
        return false;
    } else {
        return true;
    }
}

function findMaxID() {
    let sortedOrders = [...orders].sort(function (a, b) { return b.orderID - a.orderID; })
    return sortedOrders[0].orderID;
}

function clearForm() {
    document.getElementById('inputDate').value = '';
    document.getElementById('inputStatus').value = '';
    document.getElementById('inputCustomer').value = '';
    document.getElementById('inputEmail').value = '';
    document.getElementById('inputTel').value = '';
    document.getElementById('inputLocation').value = '';
}

function getOrderByID(currentID) {
    return orders.find(function (order) {
        return order.orderID === currentID;
    })
}

function editOrder(currentID) {
    let order = getOrderByID(currentID);
    let currentStatus = document.querySelector(`#status_${order.orderID}`);
    currentStatus.innerHTML = `<select id="changeStatus_${order.orderID}" class="select inputNew">
                            <option value="Pending" ${(order.status == 'Pending') ? 'selected' : ""}>Pending</option>
                            <option value="Dispatched" ${(order.status == 'Dispatched') ? 'selected' : ""}>Dispatched</option>
                            <option value="Suspended" ${(order.status == 'Suspended') ? 'selected' : ""}>Suspended</option>
                            <option value="Canceled" ${(order.status == 'Canceled') ? 'selected' : ""}>Canceled</option>
                        </select>`

    let currentCustomer = document.querySelector(`#customer_${order.orderID}`);
    currentCustomer.innerHTML = `<input type="text" id="changeCustomer_${order.orderID}" value="${order.customer}" class="inputNew">`

    let currentEmail = document.querySelector(`#email_${order.orderID}`);
    currentEmail.innerHTML = `<input type="email" id="changeEmail_${order.orderID}" value="${order.email}" class="inputNew">`

    let currentTel = document.querySelector(`#tel_${order.orderID}`);
    currentTel.innerHTML = `<input type="tel" id="changeTel_${order.orderID}" value="${order.tel}" class="inputNew">`

    let currentLocation = document.querySelector(`#location_${order.orderID}`);
    currentLocation.innerHTML = `<input type="text" id="changeLocation_${order.orderID}" value="${order.location}" class="inputNew">`

    document.querySelector(`#openMenu_${order.orderID}`).classList.add('d-none');
    document.querySelector(`#orderMenu_${order.orderID}`).classList.add('d-none');
    document.querySelector(`#saveEdit_${order.orderID}`).classList.remove('d-none');
    document.querySelector(`#resetField_${order.orderID}`).classList.remove('d-none');

}

function saveEdit(currentID) {
    let order = getOrderByID(currentID);
    let newStatus = document.querySelector(`#changeStatus_${order.orderID}`).value;
    let newCustomer = document.querySelector(`#changeCustomer_${order.orderID}`).value;
    let newEmail = document.querySelector(`#changeEmail_${order.orderID}`).value;
    let newTel = document.querySelector(`#changeTel_${order.orderID}`).value;
    let newLocation = document.querySelector(`#changeLocation_${order.orderID}`).value;

    let valid = checkValidity('valid', newCustomer, newTel, newLocation);

    if (valid) {
        order.status = newStatus;
        order.customer = newCustomer;
        order.email = newEmail;
        order.tel = newTel;
        order.location = newLocation;

        document.querySelector(`#openMenu_${order.orderID}`).classList.remove('d-none');
        document.querySelector(`#orderMenu_${order.orderID}`).classList.remove('d-none');
        document.querySelector(`#saveEdit_${order.orderID}`).classList.add('d-none');
        document.querySelector(`#resetField_${order.orderID}`).classList.add('d-none');

        setLocalStorage(orderData, orders);
        resetField(currentID);
    }
}

function resetField(currentID) {
    let order = getOrderByID(currentID);
    let currentStatus = document.querySelector(`#status_${order.orderID}`);
    currentStatus.innerHTML = `${order.status}`;

    let currentCustomer = document.querySelector(`#customer_${order.orderID}`);
    currentCustomer.innerHTML = `${order.customer}`;

    let currentEmail = document.querySelector(`#email_${order.orderID}`);
    currentEmail.innerHTML = `${order.email}`;

    let currentTel = document.querySelector(`#tel_${order.orderID}`);
    currentTel.innerHTML = `${order.tel}`;

    let currentLocation = document.querySelector(`#location_${order.orderID}`);
    currentLocation.innerHTML = `${order.location}`;

    document.querySelector(`#openMenu_${order.orderID}`).classList.remove('d-none');
    document.querySelector(`#orderMenu_${order.orderID}`).classList.remove('d-none');
    document.querySelector(`#saveEdit_${order.orderID}`).classList.add('d-none');
    document.querySelector(`#resetField_${order.orderID}`).classList.add('d-none');

}

function removeOrder(currentID) {
    let confirmed = window.confirm('Are you sure you want to delete this order?')
    if (confirmed) {
        let index = orders.findIndex(function (order) {
            return order.orderID === currentID;
        })
        orders.splice(index, 1);

        setLocalStorage(orderData, orders);
        renderOrders();
    }
}

function uncheckAllBoxes() {
    let allBoxes = document.querySelectorAll("input[type=checkbox]");
    for (Element in allBoxes) {
        if (allBoxes[Element].checked == true) {
            allBoxes[Element].checked = false;
        }
    }
}

function selectAll(deeBox) {
    let allBoxes = document.querySelectorAll("input[name=checkOrder]");
    if (deeBox.checked) {
        for (Element in allBoxes) {
            if (allBoxes[Element].checked != deeBox.checked) {
                allBoxes[Element].checked = deeBox.checked;
            }
        }
    } else {
        uncheckAllBoxes();
    }
}

function dispatchSelected() {
    let checkedBoxes = document.querySelectorAll('input[name = checkOrder]:checked');
    for (const checkedBox of checkedBoxes) {
        let id = Number(checkedBox.id.substring(9, checkedBox.length));
        let order = getOrderByID(id);
        let index = orders.indexOf(order);
        order.status = "Dispatched";
        orders[index] = order;
    }
    setLocalStorage(orderData, orders);
    renderOrders();
}

function removeSelected() {
    let confirmed = window.confirm('Are you sure you want to delete these orders?')
    if (confirmed) {
        let checkedBoxes = document.querySelectorAll('input[name = checkOrder]:checked');
        for (const checkedBox of checkedBoxes) {
            let id = Number(checkedBox.id.substring(9, checkedBox.length));
            let order = getOrderByID(id);
            let index = orders.indexOf(order);
            orders.splice(index, 1);
        }
        setLocalStorage(orderData, orders);
        renderOrders();
    }
}

(function () {
    init();
    uncheckAllBoxes();
    renderOrders();
})()