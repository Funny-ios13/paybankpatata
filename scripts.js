function end_purchase() {
    window.close()
}

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
    pricehtml.textContent = `Precio: $ ${price}`
    storehtml.textContent = `Descripción: ${description}`

    document.querySelector('.confirm-btn').addEventListener('click', function() {
        const user = document.getElementById('username').value;
        const invoiceNumber = document.getElementById('invoiceNumber').textContent; // Uso del número de factura generado
        makeTransaction(user, description, price, invoiceNumber, store);
    });

function generateRandomID() {
    return Math.floor(10000 + Math.random() * 90000);
}

function makeTransaction(userC, descriptionC, priceC, invoiceNumberC, storeC) {
    console.log(`Parametros Recibidos:\n${userC} | ${descriptionC} | ${priceC} | ${invoiceNumberC} | ${storeC}`)
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

                            const cardSTORE = cards.find(card => card.name.startsWith(`${storeC} / `));
                            const accCardSTORE = cards.find(card => card.name.startsWith(`${storeC} | `));
                            const storeCardBETAstore = cards.find(card => card.name.startsWith(`${storeC} | `));

                            if (cardSTORE && accCardSTORE) {
                                const balanceSTORE = accCardSTORE.name.split('|')[2].trim();

                                   // if (balanceSTORE === 'inf') {
                                        const cardenABLEDSTORE = accCardSTORE.name.split('|')[6].trim();

                                        if (cardenABLEDSTORE === 'true') {

                                            const newTransactionSTORE = `${`TiendaSystem#Factura:${invoiceNumberC}?Cliente:${userC}?Evento:${descriptionC}`} & ${priceC.toFixed(2)}`;
                                            const updatedTransactionsSTORE = `${cardSTORE.name} ! ${newTransactionSTORE}`;

                                            console.log(`Parametros Recibidos 2:\n\n${cardSTORE} | ${cardSTORE.name} | ${cardSTORE.id} | ${newTransactionSTORE}`);
                                            
                                        
                                   // }
                                
                                

                                fetch(`https://api.trello.com/1/cards/${cardSTORE.id}?key=${apiKey}&token=${token}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ name: updatedTransactionsSTORE })
                                })
                                .then(() => {
                                    const balance1STORE = storeCardBETAstore.name.split('|')[2].trim();
                                    const balanceValue1STORE = parseInt(balance1STORE);
                                    const priceCOBRARSTORE12 = parseInt(priceC);
                                    const priceCOBRARSTOREmmmm = priceCOBRARSTORE12 + balanceValue1STORE;
                                    const newBalance1STORE = priceCOBRARSTOREmmmm.toFixed(2);
                                    const newBalance1STOREString = newBalance1STORE.toString();
                                    console.log(`|${balance1STORE} | ${balanceValue1STORE} | ${priceCOBRARSTOREmmmm} | ${newBalance1STORE} | ${newBalance1STOREString}`);
                                    const updatedAccount1STORE = `${storeC} | ${storeCardBETAstore.name.split('|')[1].trim()} | ${newBalance1STOREString} | ${storeCardBETAstore.name.split('|')[3].trim()} | ${storeCardBETAstore.name.split('|')[4].trim()} | ${storeCardBETAstore.name.split('|')[5].trim()} | ${storeCardBETAstore.name.split('|')[6].trim()}`;
                                    //const updatedAccountSTORE = `${storeC} | ${storeCardBETAstore.name.split('|')[1].trim()} | ${newBalance1STORE} | ${storeCardBETAstore.name.split('|')[3].trim()} | ${storeCardBETAstore.name.split('|')[4].trim()} | ${storeCardBETAstore.name.split('|')[5].trim()} | ${storeCardBETAstore.name.split('|')[6].trim()}`;

                                    fetch(`https://api.trello.com/1/cards/${storeCardBETAstore.id}?key=${apiKey}&token=${token}`, {
                                            method: 'PUT',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({ name: updatedAccount1STORE })
                                        })
                                        .then(() => {
                                            //Mensaje a discord al dueño de la tienda
                                        })
                                        .catch(error => {
                                            console.log(`Ocurrio un error: ${error}`)
                                        });
                                })
                                .catch(() => {
                                    alert("Error critico en el sistema. Por favor comprueba tu conexión a internet.")
                                    return;
                                })
                            }
                            }
                            ////////

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
//////-----                                         
                                                    console.log(`PARAMS: ${cardSTORE} | ${accCardSTORE}`);


                                                    

                                                    

                                                    fetch(`https://api.trello.com/1/cards/${card.id}?key=${apiKey}&token=${token}`, {
                                                            method: 'PUT',
                                                            headers: {
                                                                'Content-Type': 'application/json'
                                                            },
                                                            body: JSON.stringify({ name: updatedTransactions })
                                                        })
                                                        .then(() => {
                                                            alert(`**TRANSACCIÓN APROBADA | #${invoiceNumberC}**\n\nLa transacción fue realizada con exito!`);
                                                            end_purchase()
                                            
                                                            const balance1 = storeCardBETA.name.split('|')[2].trim();
                                                            const balanceValue1 = parseInt(balance1);
                                                            const newBalance1 = "inf";
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
                                                            end_purchase()
                                                        });
                                                } else {
                                                    alert(`**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por que la tarjeta se encuentra bloqueada.`);
                                                    end_purchase()
                                                    return;
                                                }
                                            } else {
                                                alert('**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por un error interno. Por favor cuemprueba tu conexión a internet.'); //NO PRECIO
                                                end_purchase()
                                                return;
                                            }
                                        } else {
                                            alert('**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por un error interno. Por favor comprueba tu conexión a internet.'); //NO DESCRIPCION
                                            end_purchase()
                                            return;
                                        }
                                    } else {
                                        alert('**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por un error interno. Por favor comprueba tu conexión a internet.'); //NO USUARIO
                                        end_purchase()
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

                                                const newBalance15 = balanceValue1 - priceC;
                                                const newBalance1 = newBalance15.toFixed(2)

                                                updatedAccount1 = `${userC} | ${storeCardBETA.name.split('|')[1].trim()} | ${newBalance1} | ${storeCardBETA.name.split('|')[3].trim()} | ${storeCardBETA.name.split('|')[4].trim()} | ${storeCardBETA.name.split('|')[5].trim()} | ${storeCardBETA.name.split('|')[6].trim()}`;
                                                } else {
                                                    const balance1 = storeCardBETA.name.split('|')[2].trim();

                                                      const newBalance1 = balance1;

                                                updatedAccount1 = `${userC} | ${storeCardBETA.name.split('|')[1].trim()} | ${newBalance1} | ${storeCardBETA.name.split('|')[3].trim()} | ${storeCardBETA.name.split('|')[4].trim()} | ${storeCardBETA.name.split('|')[5].trim()} | ${storeCardBETA.name.split('|')[6].trim()}`;
                                                }
                                             //   const updatedAccount2 = `${user} | ${storeCardBETA.name.split('|')[1].trim()} | ${newBalance1} | ${storeCardBETA.name.split('|')[3].trim()} | ${storeCardBETA.name.split('|')[4].trim()} | ${storeCardBETA.name.split('|')[5].trim()} | ${storeCardBETA.name.split('|')[6].trim()}`;
                    
                      
                                                const balance = accCard.name.split('|')[2].trim();
                                                const balanceValue = parseInt(balance);

                                   
                                                const newBalance16 = balanceValue - priceC;
                                                const newBalance = newBalance16.toFixed(2)

                 

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
                                                                end_purchase()
                                                            })

                                                            .catch(error => {
                                                                alert(`**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por un error interno. Error: ${error}`);
                                                                end_purchase()
                                                            });
                                                    })
                                                    .catch(error => {
                                                        alert(`**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por un error interno. Error: ${error}`);
                                                        end_purchase()
                                                    });
                                         
                                                } else {
                                                alert('**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por un error interno. Por favor compueba tu conexión a internet..');// PRECIO 1
                                                end_purchase()
                                                return;
                                            }
                                        } else {
                                            alert('**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por un error interno. Por favor compueba tu conexión a internet..');// DESCRIPCION 1
                                                    end_purchase()
                                            return;
                                        }
                                    } else {
                                        alert('**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por un error interno. Por favor compueba tu conexión a internet..'); // USUARIO 1
                                                end_purchase()
                                        return;
                                    }
                                
                                
                                        } else {
                                            alert(`**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por que la tarjeta se encuentra bloqueada.`);
                                            end_purchase()
                                            return;
                                        }
                                    } else {
                                        alert('**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por falta de fondos en la cuenta.');
                                        end_purchase()
                                    }
                                }
                            } else {
                                alert('**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por un error interno. Por favor compueba tu conexión a internet..');// USUARIO NO ENCOTRADO 1
                                end_purchase()
                            }
                        })
                        .catch(error => {
                            alert(`**TRANSACCIÓN RECHAZADA**\n\nLa transacción fue rechazada por un error interno. Error: ${error}`);
                            end_purchase()
                        });
                })
                .catch(error => {
                    //Error creating card in 'IDS' list
                    alert(`Error critico interno. Por favor intenta verificar tu conexión a internet.`);
                    end_purchase()
                });
                
            }
            
        })
        .catch(error => {
            console.error('Error al obtener listas:', error);
            alert('Error técnico al procesar la compra');
            end_purchase()
        });
}

document.querySelector('.reject-btn').addEventListener('click', function() {
    console.log('Compra rechazada');
    close_window()
});
