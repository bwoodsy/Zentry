import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Inventory() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInventory = async () => {
      const { data, error } = await supabase.from('Inventory').select()
      if (error) console.error(error)
      else setItems(data)
      setLoading(false)
    }

    fetchInventory()
  }, [])

  return (
    <div className="p-6">
      <header className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Inventory</h1>
          </div>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {items.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold">{item.model} – {item.part_name}</h2>
              <p>📦 Quantity: {item.quantity}</p>
              <p>💰 Avg Cost: ${item.part_cost?.toFixed(2)}</p>
              <p>🚚 Avg Shipping: ${item.part_shipping_cost?.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-2">Last updated: {new Date(item.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}