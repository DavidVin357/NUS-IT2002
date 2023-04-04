import { useEffect, useState } from 'react'
import { RelationView } from '../App'
import Field from './Field'
import * as api from '../api'
import TableView from './TableView'

const Groceries = () => {
  const [customerEmail, setCustomerEmail] = useState('')
  const [SelectGrocery, setSelectGrocery] = useState('')
  const [ReceivingLocation, setReceivingLocation] = useState('')
  const [OrderDate, setOrderDate] = useState(
    new Date().toISOString().substring(0, 10)
  )
  const [OrderTime, setOrderTime] = useState(
    new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  )
  const [groceriesData, setGroceriesData] = useState<RelationView>()
  const [customersData, setCustomersData] = useState<RelationView>()
  const [driversData, setDriversData] = useState<RelationView>()

  useEffect(() => {
    api.getRelation('groceriesorder').then((data) => {
      setGroceriesData(data)
    })

    api.getRelation('customers').then((data) => {
      setCustomersData(data)
    })

    api.getRelation('drivers').then((data) => {
      setDriversData(data)
    })
  }, [])
  const clearValues = () => {
    setCustomerEmail('')
    setReceivingLocation('')
    setSelectGrocery('')
    setOrderDate(new Date().toISOString().substring(0, 10))
    setOrderTime(
      new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    )
  }
  const handleOrderCreation = async () => {
    const insertionData = {
      customer_email: customerEmail,
      select_grocery: SelectGrocery,
      receiving_location: ReceivingLocation,
      order_time: OrderTime,
      order_date: OrderDate,
    }

    for (const [key, value] of Object.entries(insertionData)) {
      if (!value) {
        alert(`${key} cannot be empty`)
        return
      }
    }

    let success = await api.createGrocery(insertionData)
    if (!success) {
      return
    }

    // Clear fields
    clearValues()

    // Refresh Orders table
    api.getRelation('groceriesorder').then((data) => {
      setGroceriesData(data)
    })
  }
  const onCustomerEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCustomerEmail(e.target.value)

  const onSelectGroceryChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelectGrocery(e.target.value)

  const onReceivingLocation = (e: React.ChangeEvent<HTMLInputElement>) =>
    setReceivingLocation(e.target.value)

  const onTimeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setOrderTime(e.target.value)
    
  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setOrderDate(e.target.value)
  
  return (
    <div className='container'>
      <div className='order-grocery-view'>
        <h1>Order Grocery</h1>
        <Field
          fieldType='email'
          fieldName='customer_email'
          title='Customer email'
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
        />
        <Field
          fieldType='text'
          fieldName='select_grocery'
          title='Select Grocery'
          value={SelectGrocery}
          onChange={(e) => setSelectGrocery(e.target.value)}
        />
        <Field
          fieldType='text'
          fieldName='receiving_location'
          title='Receiving Location'
          value={ReceivingLocation}
          onChange={(e) => setReceivingLocation(e.target.value)}
        />
        <Field
          fieldType='time'
          fieldName='departure_time'
          title='Time of Order'
          value={OrderTime}
          onChange={(e) => setOrderTime(e.target.value)}
        />
        <Field
          fieldType='date'
          fieldName='order_date'
          title='Date of order'
          value={OrderDate}
          onChange={(e) => setOrderTime(e.target.value)}
        />
        <button onClick={handleOrderCreation}>Order Grocery</button>
      </div>
      <div className='tables'>
        <div className='order-table'>
          <h1>Orders</h1>

          {groceriesData ? (
            <TableView relationView={groceriesData} />
          ) : (
            <h2>No orders yet</h2>
          )}
        </div>

        <div className='users-table'>
          <div className='customers'>
            <h2>Current customers</h2>

            {customersData?.columns.length ? (
              <TableView relationView={customersData} />
            ) : (
              <h2>No customers yet</h2>
            )}
          </div>
          <div className='drivers'>
            <h2>Current drivers</h2>

            {driversData?.columns.length ? (
              <TableView relationView={driversData} />
            ) : (
              <h2>No drivers yet</h2>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Groceries