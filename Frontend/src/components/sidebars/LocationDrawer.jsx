import { useEffect, useState } from 'react'
import { X, MapPin, Check, Plus, Navigation } from 'lucide-react'
import { useUI } from '../../context/UIContext'

const SAVED_ADDRESSES = [
  {
    id: 'addr-1',
    label: 'Home',
    village: 'Ajmer - Village A',
    details: 'Near Government School, Ajmer, Rajasthan',
    pincode: '305001'
  },
  {
    id: 'addr-2',
    label: 'Work',
    village: 'Ajmer - Village B',
    details: 'Main Road Panchayat Bhawan, Ajmer',
    pincode: '305002'
  },
  {
    id: 'addr-3',
    label: 'Farm / Warehouse',
    village: 'Kishangarh Rural',
    details: 'Mandi Road, Near Solar Substation',
    pincode: '305801'
  }
]

export default function LocationDrawer() {
  const { isLocationDrawerOpen, setIsLocationDrawerOpen, selectedLocation, setSelectedLocation } = useUI()
  const [addresses, setAddresses] = useState(SAVED_ADDRESSES)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newVillage, setNewVillage] = useState('')
  const [newDetails, setNewDetails] = useState('')
  const [newPincode, setNewPincode] = useState('')

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isLocationDrawerOpen) {
        setIsLocationDrawerOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLocationDrawerOpen, setIsLocationDrawerOpen])

  if (!isLocationDrawerOpen) return null

  const handleSelectAddress = (addr) => {
    setSelectedLocation({
      village: addr.village,
      pincode: addr.pincode,
      landmark: addr.details,
      state: 'Rajasthan'
    })
    setIsLocationDrawerOpen(false)
  }

  const handleAddNewAddress = (e) => {
    e.preventDefault()
    if (!newVillage.trim()) return

    const newAddr = {
      id: `addr-${Date.now()}`,
      label: 'Other',
      village: newVillage,
      details: newDetails || 'Village center',
      pincode: newPincode || '305001'
    }

    setAddresses(prev => [...prev, newAddr])
    handleSelectAddress(newAddr)
    setIsAddingNew(false)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsLocationDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300 ease-out">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-blue-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 text-white rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Delivery Location</h2>
                <p className="text-xs text-gray-500">Select village for instant 2-3 hour delivery</p>
              </div>
            </div>
            <button
              onClick={() => setIsLocationDrawerOpen(false)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Close location drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Auto Detect Location Button */}
            <button
              onClick={() => {
                setSelectedLocation({
                  village: 'Ajmer - Village A (GPS)',
                  pincode: '305001',
                  landmark: 'Auto-detected Village center',
                  state: 'Rajasthan'
                })
                setIsLocationDrawerOpen(false)
              }}
              className="w-full flex items-center justify-between p-3.5 bg-blue-50 hover:bg-blue-100/70 border border-blue-200 rounded-2xl text-blue-700 transition-colors group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl text-blue-600 shadow-xs">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-900">Detect Current Village</div>
                  <div className="text-[11px] text-blue-600">Using device GPS</div>
                </div>
              </div>
              <span className="text-xs font-semibold underline">Detect</span>
            </button>

            {/* Saved Addresses Section */}
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Saved Addresses</h3>
              <div className="space-y-2.5">
                {addresses.map((addr) => {
                  const isSelected = selectedLocation.village === addr.village

                  return (
                    <div
                      key={addr.id}
                      onClick={() => handleSelectAddress(addr)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                            {addr.label}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">{addr.village}</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{addr.details}</p>
                        <p className="text-[11px] text-gray-400">PIN: {addr.pincode}</p>
                      </div>

                      {isSelected && (
                        <div className="p-1 rounded-full bg-blue-600 text-white shrink-0 mt-1">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Add New Address Accordion / Form */}
            <div className="pt-2 border-t border-gray-100">
              {!isAddingNew ? (
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="w-full py-3 px-4 border border-dashed border-gray-300 hover:border-blue-500 rounded-2xl text-xs font-semibold text-gray-600 hover:text-blue-600 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Village Address</span>
                </button>
              ) : (
                <form onSubmit={handleAddNewAddress} className="bg-gray-50 p-4 rounded-2xl space-y-3 border border-gray-200">
                  <h4 className="text-xs font-bold text-gray-800">Add Village Address</h4>
                  <div>
                    <label className="text-[11px] font-medium text-gray-600 block mb-1">Village / Locality</label>
                    <input
                      type="text"
                      placeholder="e.g. Ajmer - Village C"
                      value={newVillage}
                      onChange={(e) => setNewVillage(e.target.value)}
                      required
                      className="w-full text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-600 block mb-1">Landmark / House Info</label>
                    <input
                      type="text"
                      placeholder="e.g. Near Water Tank"
                      value={newDetails}
                      onChange={(e) => setNewDetails(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-600 block mb-1">Pincode</label>
                    <input
                      type="text"
                      placeholder="e.g. 305001"
                      value={newPincode}
                      onChange={(e) => setNewPincode(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Save & Deliver Here
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
