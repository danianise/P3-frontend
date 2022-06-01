import React from 'react'

function UserInfo({data}) {

  return (

  !data ? "Loading"
   : <div>
        <h4 className="userName">user: {data[0].Username}</h4>
<<<<<<< HEAD
<<<<<<< HEAD
        <p>Cash Balance: ${data[0].CashBalance.toFixed(2)}</p>
=======
        <p>Cash Balance: ${data[0].CashBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
>>>>>>> 6f2aceac6765deb43464a94a98d7669fff62628d
=======
        <p>Cash Balance: ${data[0].CashBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
>>>>>>> 16afb64 (start to styling changes, formatted dollar amounts and decimals)
    </div>
  )
}

export default UserInfo