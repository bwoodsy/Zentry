import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Inventory() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filterModel, setFilterModel] = useState('')
  const [filterPartName, setFilterPartName] = useState('')
  const [filterColor, setFilterColor] = useState('')
  const [editItem, setEditItem] = useState(null)
  const [search, setSearch] = useState("")

  // Move fetchInventory above useEffect
  const fetchInventory = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('Inventory').select()
    if (error) {
      console.error(error)
      setLoading(false)
    } else {
      setItems(data)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target

    const newItem = {
      model: form.model.value,
      part_name: form.part_name.value,
      part_cost: parseFloat(form.part_cost.value),
      part_shipping_cost: parseFloat(form.part_shipping_cost.value),
      color: form.color.value || null,
      quantity: parseInt(form.quantity.value),
    }

    const { error } = await supabase.from('Inventory').insert([newItem])
    if (error) {
      console.error('Insert failed:', error)
      alert('Insert failed: ' + error.message)
    } else {
      form.reset()
      setShowModal(false)
      fetchInventory()
    }
  }

  // Delete item
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return
    const { error } = await supabase.from('Inventory').delete().eq('id', id)
    if (error) {
      alert('Delete failed: ' + error.message)
    } else {
      fetchInventory()
    }
  }

  // Update item
  const handleUpdate = async (e) => {
    e.preventDefault()
    const form = e.target
    const updatedItem = {
      model: form.model.value,
      part_name: form.part_name.value,
      part_cost: parseFloat(form.part_cost.value),
      part_shipping_cost: parseFloat(form.part_shipping_cost.value),
      color: form.color.value,
      quantity: parseInt(form.quantity.value),
    }
    const { error } = await supabase
      .from('Inventory')
      .update(updatedItem)
      .eq('id', editItem.id)
    if (error) {
      alert('Update failed: ' + error.message)
    } else {
      setEditItem(null)
      fetchInventory()
    }
  }

  // Filtering logic (now includes search)
  const filteredItems = items.filter(item =>
    (item.model || '').toLowerCase().includes(filterModel.toLowerCase()) &&
    (item.part_name || '').toLowerCase().includes(filterPartName.toLowerCase()) &&
    (item.color || '').toLowerCase().includes(filterColor.toLowerCase()) &&
    ((item.model || '') + ' ' + (item.part_name || '') + ' ' + (item.sku || '') + ' ' + (item.color || '') + ' ' + (item.location || '')).toLowerCase().includes(search.toLowerCase())
  )

  // Summary metrics
  const totalItems = items.length;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + item.quantity * item.part_cost, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-0">
      <div className="bg-white shadow-sm mb-8 rounded-b-3xl">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Remove the page title h1 to avoid duplicate page name with the navbar */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search inventory..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-indigo-200 rounded-lg px-3 py-2 bg-white shadow-sm focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>
        </div>
      </div>
      {/* Summary Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 px-4">
        <div className="bg-gradient-to-tr from-indigo-500 to-indigo-400 text-white rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:scale-[1.03] transition">
          <div className="bg-white/20 rounded-full p-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M3 10h18" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-semibold">Total Items</div>
            <div className="text-2xl font-bold">{totalItems}</div>
          </div>
        </div>
        <div className="bg-gradient-to-tr from-green-500 to-green-400 text-white rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:scale-[1.03] transition">
          <div className="bg-white/20 rounded-full p-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M3 10h18" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-semibold">Total Quantity</div>
            <div className="text-2xl font-bold">{totalQuantity}</div>
          </div>
        </div>
        <div className="bg-gradient-to-tr from-purple-500 to-fuchsia-400 text-white rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:scale-[1.03] transition">
          <div className="bg-white/20 rounded-full p-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M3 10h18" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-semibold">Total Value</div>
            <div className="text-2xl font-bold">${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
          </div>
        </div>
      </div>
      {/* Inventory Table */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 px-2 md:px-6 hover:shadow-xl transition mb-10">
        <div className="flex flex-row justify-between items-center mb-4">
          <h2 className="font-semibold text-indigo-700 text-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M3 10h18" />
            </svg>
            Inventory List
          </h2>
          <button
            className="bg-gray-200 text-black px-4 py-2 rounded font-semibold hover:bg-gray-300 transition"
            onClick={() => setShowModal(true)}
          >
            Add Item
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 font-medium text-gray-700">Name</th>
                <th className="py-2 px-4 font-medium text-gray-700">SKU</th>
                <th className="py-2 px-4 font-medium text-gray-700">Quantity</th>
                <th className="py-2 px-4 font-medium text-gray-700">Location</th>
                <th className="py-2 px-4 font-medium text-gray-700">Cost</th>
                <th className="py-2 px-4 font-medium text-gray-700">Value</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-400">
                    No items found.
                  </td>
                </tr>
              )}
              {filteredItems.map(item => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-indigo-50 transition">
                  <td className="py-2 px-4 font-medium">{item.model} – {item.part_name}</td>
                  <td className="py-2 px-4">{item.sku}</td>
                  <td className={`py-2 px-4 ${item.quantity < 20 ? "text-red-600 font-bold" : ""}`}>{item.quantity}</td>
                  <td className="py-2 px-4">{item.location}</td>
                  <td className="py-2 px-4">${item.part_cost.toFixed(2)}</td>
                  <td className="py-2 px-4">${(item.quantity * item.part_cost).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">Add Inventory Item</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input name="model" placeholder="Model" className="border rounded px-3 py-2" required />
              <input name="part_name" placeholder="Part Name" className="border rounded px-3 py-2" required />
              <input name="sku" placeholder="SKU" className="border rounded px-3 py-2" />
              <input name="part_cost" placeholder="Part Cost" type="number" step="0.01" className="border rounded px-3 py-2" required />
              <input name="part_shipping_cost" placeholder="Shipping Cost" type="number" step="0.01" className="border rounded px-3 py-2" />
              <input name="color" placeholder="Color" className="border rounded px-3 py-2" />
              <input name="quantity" placeholder="Quantity" type="number" className="border rounded px-3 py-2" required />
              <button type="submit" className="bg-gray-200 text-black px-4 py-2 rounded font-semibold hover:bg-gray-300 transition">Add</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}