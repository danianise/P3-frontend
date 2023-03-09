import React from 'react'
import {BsPersonCircle} from 'react-icons/bs'

function UserInfo({data}) {

  return (

  !data ? "Loading"
   : <div className = 'userInfo'>
        <h4 className="userName">
          <BsPersonCircle/> {data[0].Username}
        </h4>
        <p>Cash Balance: {data[0].CashBalance.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</p>
    </div>
  )
}

export default UserInfo