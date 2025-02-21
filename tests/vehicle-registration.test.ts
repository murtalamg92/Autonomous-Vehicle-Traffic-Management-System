import { describe, it, beforeEach, expect } from "vitest"

describe("Vehicle Registration Contract", () => {
  let mockStorage: Map<string, any>
  let currentBlockHeight: number
  
  beforeEach(() => {
    mockStorage = new Map()
    currentBlockHeight = 100
  })
  
  const mockContractCall = (method: string, args: any[], sender: string) => {
    switch (method) {
      case "register-vehicle":
        const [vehicleId, model] = args
        mockStorage.set(`vehicle-${vehicleId}`, {
          owner: sender,
          model: model,
          registration_date: currentBlockHeight,
          status: "active",
        })
        return { success: true }
      
      case "update-vehicle-status":
        const [updateVehicleId, newStatus] = args
        const vehicle = mockStorage.get(`vehicle-${updateVehicleId}`)
        if (!vehicle) return { success: false, error: 404 }
        if (vehicle.owner !== sender) return { success: false, error: 403 }
        vehicle.status = newStatus
        mockStorage.set(`vehicle-${updateVehicleId}`, vehicle)
        return { success: true }
      
      case "get-vehicle":
        return { success: true, value: mockStorage.get(`vehicle-${args[0]}`) }
      
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should register a vehicle", () => {
    const result = mockContractCall("register-vehicle", ["VIN123456789", "Tesla Model 3"], "user1")
    expect(result.success).toBe(true)
  })
  
  it("should update vehicle status", () => {
    mockContractCall("register-vehicle", ["VIN123456789", "Tesla Model 3"], "user1")
    const result = mockContractCall("update-vehicle-status", ["VIN123456789", "maintenance"], "user1")
    expect(result.success).toBe(true)
  })
  
  it("should not update vehicle status if not the owner", () => {
    mockContractCall("register-vehicle", ["VIN123456789", "Tesla Model 3"], "user1")
    const result = mockContractCall("update-vehicle-status", ["VIN123456789", "maintenance"], "user2")
    expect(result.success).toBe(false)
    expect(result.error).toBe(403)
  })
  
  it("should get vehicle information", () => {
    mockContractCall("register-vehicle", ["VIN123456789", "Tesla Model 3"], "user1")
    const result = mockContractCall("get-vehicle", ["VIN123456789"], "anyone")
    expect(result.success).toBe(true)
    expect(result.value).toEqual({
      owner: "user1",
      model: "Tesla Model 3",
      registration_date: 100,
      status: "active",
    })
  })
})

