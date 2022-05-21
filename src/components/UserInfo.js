import React from 'react'

function UserInfo({data}) {
  return (
    <div>
        <h4 className="userName">Username: {data[0].Username}</h4>
        <p>Cash Balance: ${data[0].CashBalance}</p>
    </div>
  )
}

export default UserInfo