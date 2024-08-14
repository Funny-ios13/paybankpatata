document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    checkLogin(username, password);
});

function checkLogin(username, password) {
    const boardId = '4nP65kjP';
    const apiKey = '42c42b2aeb78d2b5048bc85c88041207';
    const token = '5d2c98ce4d6ca544fca293a91f7720b55d79832cdf431358705656707ea11e1b';

    fetch(`https://api.trello.com/1/boards/${boardId}/cards?key=${apiKey}&token=${token}`)
        .then(response => response.json())
        .then(cards => {
            const user = cards.find(card => {
                const [storedUsername, storedPassword] = card.name.split(' | ');
                return storedUsername === username && storedPassword === password;
            });
            if (user) {
                document.querySelector('.login-container').classList.add('hidden');
                document.querySelector('.purchase-container').classList.remove('hidden');
                document.getElementById('invoiceNumber').textContent = generateRandomID();
            } else {
                alert('Usuario o contraseña inválidos');
            }
        })
        .catch(error => {
            console.error('Error al conectarse a Trello:', error);
            alert('Error al intentar iniciar sesión');
        });
}

const urlParams = new URLSearchParams(window.location.search);
    const description = urlParams.get('description');  // Obtiene 'description' desde la URL
    const price = parseFloat(urlParams.get('price'));  // Obtiene 'price' desde la URL y lo convierte a float
    const store = urlParams.get('store');  // Obtiene 'store' desde la URL

    const pricehtml = document.getElementById('price-html');
    const storehtml = document.getElementById('store-html');
    console.log(`1\nPriceHTML: ${pricehtml} | StoreHTML: ${storehtml}`);
    pricehtml.textContent = `Precio: $ ${price}`
    storehtml.textContent = `Tienda: ${store}`
    console.log(`2\nPriceHTML: ${pricehtml.textContent} | StoreHTML: ${storehtml.textContent}`);

    document.querySelector('.confirm-btn').addEventListener('click', function() {
        const user = document.getElementById('username').value;
        const invoiceNumber = document.getElementById('invoiceNumber').textContent; // Uso del número de factura generado
        makeTransaction(user, description, price, invoiceNumber, store);
    });

function generateRandomID() {
    return Math.floor(10000 + Math.random() * 90000);
}

function makeTransaction(userC, descriptionC, priceC, invoiceNumberC, storeC) {
    const boardId = '4nP65kjP';
    const apiKey = '42c42b2aeb78d2b5048bc85c88041207';
    const token = '5d2c98ce4d6ca544fca293a91f7720b55d79832cdf431358705656707ea11e1b';

    fetch(`https://api.trello.com/1/boards/${boardId}/lists?key=${apiKey}&token=${token}`)
        .then(response => response.json())
        .then(lists => {
            const idsList = lists.find(list => list.name === 'IDS');
            if (idsList) {
                const formattedDate = new Date().toLocaleString();
                const cardName = `#${invoiceNumberC} | STORE: ${storeC} | ${userC} | ${descriptionC} | ${priceC} | ${formattedDate}`;
                fetch(`https://api.trello.com/1/cards?key=${apiKey}&token=${token}&idList=${idsList.id}&name=${cardName}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: cardName })
                })
                .then(() => {
                    fetch(`https://api.trello.com/1/boards/${boardId}/cards?key=${apiKey}&token=${token}`)
                        .then(response => response.json())
                        .then(cards => {
                            const card = cards.find(card => card.name.startsWith(`${userC} / `));
                            const accCard = cards.find(card => card.name.startsWith(`${userC} | `));
                            const storeCardBETA = cards.find(card => card.name.startsWith(`${userC} | `));

                            if (card && accCard) {
                                const balance = accCard.name.split('|')[2].trim();

                                if (balance === 'inf') {
                                    if (userC !== "") {
                                        if (descriptionC !== "") {
                                            if (priceC !== "" && !isNaN(priceC)) {
                                                const cardenABLED = accCard.name.split('|')[6].trim();

                                                if (cardenABLED === 'true') {

                                                    const newTransaction = `${descriptionC} & ${priceC.toFixed(2)}`;
                                                    const updatedTransactions = `${card.name} ! ${newTransaction}`;

                                                    fetch(`https://api.trello.com/1/cards/${card.id}?key=${apiKey}&token=${token}`, {
                                                            method: 'PUT',
                                                            headers: {
                                                                'Content-Type': 'application/json'
                                                            },
                                                            body: JSON.stringify({ name: updatedTransactions })
                                                        })
                                                        .then(() => {
                                                            alert(`**TRANSACCIÓN APROBADA | #${invoiceNumberC}**\n\nLa transacción fue realizada con exito!`);
                                            
                                                            const balance1 = storeCardBETA.name.split('|')[2].trim();
                                                            const balanceValue1 = parseInt(balance1);
                                                            const newBalance1 = balanceValue1 + price;
                                                            const updatedAccount1 = `${userC} | ${storeCardBETA.name.split('|')[1].trim()} | ${newBalance1} | ${storeCardBETA.name.split('|')[3].trim()} | ${storeCardBETA.name.split('|')[4].trim()} | ${storeCardBETA.name.split('|')[5].trim()} | ${storeCardBETA.name.split('|')[6].trim()}`;
                                                            const updatedAccount = `${userC} | ${storeCardBETA.name.split('|')[1].trim()} | ${newBalance1} | ${storeCardBETA.name.split('|')[3].trim()} | ${storeCardBETA.name.split('|')[4].trim()} | ${storeCardBETA.name.split('|')[5].trim()} | ${storeCardBETA.name.split('|')[6].trim()}`;

                                                            fetch(`https://api.trello.com/1/cards/${storeCardBETA.id}?key=${apiKey}&token=${token}`, {
                                                                    method: 'PUT',
                                                                    headers: {
                                                                        'Content-Type': 'application/json'
                                                                    },
                                                                    body: JSON.stringify({ name: updatedAccount1 })
                                                                })
                                                                .then(() => {
                                                                    //Mensaje a discord al dueño de la tienda
                                                                })
                                                                .catch(error => {
                                                                    console.log(`Ocurrio un error: ${error}`)
                                                                });

                                                        })
                                                        .catch(error => {
                                                            alert(`**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por un error interno. Error: ${error}`);
                                                        });
                                                } else {
                                                    alert(`**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por que la tarjeta se encuentra bloqueada.`);
                                                    return;
                                                }
                                            } else {
                                                alert('**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por un error interno. Por favor cuemprueba tu conexión a internet.'); //NO PRECIO
                                                return;
                                            }
                                        } else {
                                            alert('**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por un error interno. Por favor cuemprueba tu conexión a internet.'); //NO DESCRIPCION
                                            return;
                                        }
                                    } else {
                                        alert('**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por un error interno. Por favor cuemprueba tu conexión a internet.'); //NO USUARIO
                                        return;
                                    }
                                } else {
                                    const balanceValue = parseInt(balance);

                                    if (balanceValue >= priceC) {
                                        const cardenABLED = accCard.name.split('|')[6].trim();

                                        if (cardenABLED === 'true') {
                                          
                                            if (userC !== "") {
                                                if (descriptionC !== "") {
                                                    if (priceC !== "" && !isNaN(priceC)) {
                                               
                                  
                                                let updatedAccount1

                                                if (storeCardBETA.name.split('|')[2].trim() !== 'inf') {
                                                    const balance1 = storeCardBETA.name.split('|')[2].trim();
                                                const balanceValue1 = parseInt(balance1);

                                                const newBalance1 = balanceValue1 + priceC;

                                                updatedAccount1 = `${userC} | ${storeCardBETA.name.split('|')[1].trim()} | ${newBalance1} | ${storeCardBETA.name.split('|')[3].trim()} | ${storeCardBETA.name.split('|')[4].trim()} | ${storeCardBETA.name.split('|')[5].trim()} | ${storeCardBETA.name.split('|')[6].trim()}`;
                                                } else {
                                                    const balance1 = storeCardBETA.name.split('|')[2].trim();

                                                      const newBalance1 = balance1;

                                                updatedAccount1 = `${userC} | ${storeCardBETA.name.split('|')[1].trim()} | ${newBalance1} | ${storeCardBETA.name.split('|')[3].trim()} | ${storeCardBETA.name.split('|')[4].trim()} | ${storeCardBETA.name.split('|')[5].trim()} | ${storeCardBETA.name.split('|')[6].trim()}`;
                                                }
                                             //   const updatedAccount2 = `${user} | ${storeCardBETA.name.split('|')[1].trim()} | ${newBalance1} | ${storeCardBETA.name.split('|')[3].trim()} | ${storeCardBETA.name.split('|')[4].trim()} | ${storeCardBETA.name.split('|')[5].trim()} | ${storeCardBETA.name.split('|')[6].trim()}`;
                    
                      
                                                const balance = accCard.name.split('|')[2].trim();
                                                const balanceValue = parseInt(balance);

                                   
                                                const newBalance = balanceValue - priceC;

                 

                                                const updatedAccount = `${userC} | ${accCard.name.split('|')[1].trim()} | ${newBalance} | ${accCard.name.split('|')[3].trim()} | ${accCard.name.split('|')[4].trim()} | ${accCard.name.split('|')[5].trim()} | ${accCard.name.split('|')[6].trim()}`;
                                                fetch(`https://api.trello.com/1/cards/${storeCardBETA.id}?key=${apiKey}&token=${token}`, {
                                                        method: 'PUT',
                                                        headers: {
                                                            'Content-Type': 'application/json'
                                                        },
                                                        body: JSON.stringify({ name: updatedAccount1 })
                                                    })

                                                    .then(() => {
                                                        //Mensaje a discord al dueño de la tienda
                                                    })
                                                    .catch(error => {
                                                        console.log(`Ocurrido un error: ${error}`)
                                                    });

                                                    //EN ESTA PARTE 

                                                fetch(`https://api.trello.com/1/cards/${accCard.id}?key=${apiKey}&token=${token}`, {
                                                        method: 'PUT',
                                                        headers: {
                                                            'Content-Type': 'application/json'
                                                        },
                                                        body: JSON.stringify({ name: updatedAccount }) //JUSTO AQUI
                                                    })

                                                    .then(() => {
                                                        const newTransaction = `${description} & ${price.toFixed(2)}`;
                                                        const updatedTransactions = `${card.name} ! ${newTransaction}`;

                                                        fetch(`https://api.trello.com/1/cards/${card.id}?key=${apiKey}&token=${token}`, {
                                                                method: 'PUT',
                                                                headers: {
                                                                    'Content-Type': 'application/json'
                                                                },
                                                                body: JSON.stringify({ name: updatedTransactions })
                                                            })

                                                            .then(() => {
                                                                alert(`**TRANSACCIÓN APROBADA | #${invoiceNumberC}**\n\nLa transacción fue realizada con exito!`);
                                                            })

                                                            .catch(error => {
                                                                alert(`**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por un error interno. Error: ${error}`);
                                                            });
                                                    })
                                                    .catch(error => {
                                                        alert(`**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por un error interno. Error: ${error}`);
                                                    });
                                         
                                                } else {
                                                alert('**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por un error interno. Por favor compueba tu conexión a internet..');// PRECIO 1
                                                return;
                                            }
                                        } else {
                                            alert('**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por un error interno. Por favor compueba tu conexión a internet..');// DESCRIPCION 1
                                            return;
                                        }
                                    } else {
                                        alert('**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por un error interno. Por favor compueba tu conexión a internet..'); // USUARIO 1
                                        return;
                                    }
                                
                                
                                        } else {
                                            alert(`**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por que la tarjeta se encuentra bloqueada.`);
                                            return;
                                        }
                                    } else {
                                        alert('**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por falta de fondos en la cuenta.');
                                    }
                                }
                            } else {
                                alert('**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por un error interno. Por favor compueba tu conexión a internet..');// USUARIO NO ENCOTRADO 1
                            }
                        })
                        .catch(error => {
                            alert(`**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por un error interno. Error: ${error}`);
                        });
                })
                .catch(error => {
                    //Error creating card in 'IDS' list
                    alert(`Error critico interno. Por favor intenta verificar tu conexión a internet.`);
                });
                
            }
            
        })
        .catch(error => {
            console.error('Error al obtener listas:', error);
            alert('Error técnico al procesar la compra');
        });
}

document.querySelector('.reject-btn').addEventListener('click', function() {
    console.log('Compra rechazada');
    close_window()
});
