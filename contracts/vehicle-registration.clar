;; Vehicle Registration Contract

(define-map vehicles
  { vehicle-id: (string-ascii 17) }
  {
    owner: principal,
    model: (string-ascii 50),
    registration-date: uint,
    status: (string-ascii 20)
  }
)

(define-public (register-vehicle (vehicle-id (string-ascii 17)) (model (string-ascii 50)))
  (ok (map-set vehicles
    { vehicle-id: vehicle-id }
    {
      owner: tx-sender,
      model: model,
      registration-date: block-height,
      status: "active"
    }
  ))
)

(define-public (update-vehicle-status (vehicle-id (string-ascii 17)) (new-status (string-ascii 20)))
  (let
    ((vehicle (unwrap! (map-get? vehicles { vehicle-id: vehicle-id }) (err u404))))
    (asserts! (is-eq tx-sender (get owner vehicle)) (err u403))
    (ok (map-set vehicles
      { vehicle-id: vehicle-id }
      (merge vehicle { status: new-status })
    ))
  )
)

(define-read-only (get-vehicle (vehicle-id (string-ascii 17)))
  (map-get? vehicles { vehicle-id: vehicle-id })
)

