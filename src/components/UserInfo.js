import React from 'react'

function UserInfo({data}) {

  return (

  !data ? "Loading"
   : <div>
        <h4 className="userName">user: {data[0].Username}</h4>
        <p>Cash Balance: ${data[0].CashBalance.toFixed(2)}</p>
    </div>
  )
}

export default UserInfo