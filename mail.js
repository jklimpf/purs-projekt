const sgMail = require('@sendgrid/mail')
const dotenv = require('dotenv')

//učitavanje config direktorija
dotenv.config({path: './config/dev.env'})

const sendgridAPIKey = process.env.SENDGRID_API_KEY
sgMail.setApiKey(sendgridAPIKey)

//definiranje funkcija za slanje mail-ova
const sendWarningMailSoba1 = () => {
    sgMail.send({
        to: 'josipjosip1411@gmail.com',
        from: 'josipk1411@gmail.com',
        subject: 'Upozorenje za sobu 1!',
        text: 'Visoka temperatura ili kocentracija plina u sobi 1!'
    }).then(() => {
        console.log('\nTemperatura ili koncentracija plina u sobi 1 je previsoka.\nPoslana poruka.\n')
    }).catch((error) => {
        console.log(error)
    })
}

const sendWarningMailSoba2 = () => {
    sgMail.send({
        to: 'josipjosip1411@gmail.com',
        from: 'josipk1411@gmail.com',
        subject: 'Upozorenje za sobu 2!',
        text: 'Visoka temperatura ili kocentracija plina u sobi 2!'
    }).then(() => {
        console.log('\nTemperatura ili koncentracija plina u sobi 2 previsoka.\nPoslana poruka.\n')
    }).catch((error) => {
        console.log(error)
    })
}

const sensor1Warning = () => {
    sgMail.send({
        to: 'josipjosip1411@gmail.com',
        from: 'josipk1411@gmail.com',
        subject: 'Neispravnost senzora 1',
        text: 'Senzor1 ne bilježi temperaturu!'
    }).then(() => {
        console.log('\nSenzor1 ne bilježi temperaturu.\nPoslana poruka.\n')
    }).catch((error) => {
        console.log(error)
    })
}

const sensor2Warning = () => {
    sgMail.send({
        to: 'josipjosip1411@gmail.com',
        from: 'josipk1411@gmail.com',
        subject: 'Neispravnost senzora 2',
        text: 'Senzor2 ne bilježi temperaturu!'
    }).then(() => {
        console.log('\nSenzor2 ne bilježi temperaturu.\nPoslana poruka.\n')
    }).catch((error) => {
        console.log(error)
    })
}

const gasSensorWarning = () => {
    sgMail.send({
        to: 'josipjosip1411@gmail.com',
        from: 'josipk1411@gmail.com',
        subject: 'Neispravnost senzora plina 1',
        text: 'Senzor plina 1 ne bilježi koncetraciju plinova!'
    }).then(() => {
        console.log('\nSenzor plina 1 ne bilježi koncetraciju plinova.\nPoslana poruka.\n')
    }).catch((error) => {
        console.log(error)
    })
}

const gasSensor2Warning = () => {
    sgMail.send({
        to: 'josipjosip1411@gmail.com',
        from: 'josipk1411@gmail.com',
        subject: 'Neispravnost senzora plina 2',
        text: 'Senzor plina 2 ne bilježi koncetraciju plinova!'
    }).then(() => {
        console.log('\nSenzor plina 2 ne bilježi koncetraciju plinova.\nPoslana poruka.\n')
    }).catch((error) => {
        console.log(error)
    })
}

const dbError = () => {
    sgMail.send({
        to: 'josipjosip1411@gmail.com',
        from: 'josipk1411@gmail.com',
        subject: 'Nemogucnost spajanja s bazom podataka',
        text: 'Podaci se ne salju u bazu podataka, provjeriti grešku!'
    }).then(() => {
        console.log('\nPoslano upozorenje za gresku baze podataka.\n')
    }).catch((error) => {
        console.log(error)
    })
}

module.exports = {
    sendWarningMailSoba1: sendWarningMailSoba1,
    sendWarningMailSoba2: sendWarningMailSoba2,
    sensor1Warning: sensor1Warning,
    sensor2Warning: sensor2Warning,
    gasSensorWarning: gasSensorWarning,
    gasSensor2Warning: gasSensor2Warning,
    dbError: dbError
}



