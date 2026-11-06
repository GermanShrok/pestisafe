import { useMemo, useState } from 'react'
import { CROPS } from '../lib/catalog'
import { checkPesticide, findPesticideProduct, PESTICIDE_PRODUCTS } from '../lib/pesticideChecker'

export default function PesticideChecker() {
  const [productId, setProductId] = useState(PESTICIDE_PRODUCTS[0].id)
  const [cropId, setCropId] = useState('canola')
  const [cropFlowering, setCropFlowering] = useState(true)
  const [pollinatorsDetected, setPollinatorsDetected] = useState(true)

  const product = findPesticideProduct(productId)
  const crop = CROPS.find((c) => c.id === cropId)
  const result = useMemo(
    () => checkPesticide({ product, cropFlowering, pollinatorsDetected }),
    [product, cropFlowering, pollinatorsDetected],
  )

  return (
    <section className="page" aria-labelledby="checker-heading">
      <div className="page-header">
        <h1 id="checker-heading">Pesticide checker</h1>
        <p>Pick a product and field conditions to see an illustrative pollinator-risk warning.</p>
      </div>

      <div className="checker__layout">
        <form className="card" onSubmit={(e) => e.preventDefault()}>
          <label className="field" htmlFor="product">
            <span>Pesticide product</span>
            <select id="product" value={productId} onChange={(e) => setProductId(e.target.value)}>
              {PESTICIDE_PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category})
                </option>
              ))}
            </select>
          </label>

          <label className="field" htmlFor="checker-crop">
            <span>Crop</span>
            <select id="checker-crop" value={cropId} onChange={(e) => setCropId(e.target.value)}>
              {CROPS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field-checkbox" htmlFor="checker-flowering">
            <input
              id="checker-flowering"
              type="checkbox"
              checked={cropFlowering}
              onChange={(e) => setCropFlowering(e.target.checked)}
            />
            <span>Crop is currently flowering</span>
          </label>

          <label className="field-checkbox" htmlFor="checker-pollinators">
            <input
              id="checker-pollinators"
              type="checkbox"
              checked={pollinatorsDetected}
              onChange={(e) => setPollinatorsDetected(e.target.checked)}
            />
            <span>Pollinators detected nearby</span>
          </label>
        </form>

        <div className="card">
          <h3>{product.name}</h3>
          <p>Crop selected: {crop.label}</p>

          <dl className="checker__product-meta">
            <dt>Category</dt>
            <dd>{product.category}</dd>
            <dt>Active ingredient</dt>
            <dd>{product.activeIngredient}</dd>
            <dt>Toxicity to bees</dt>
            <dd>{product.toxicityNote}</dd>
            <dt>Residual activity</dt>
            <dd>{product.residualActivity ? 'Yes' : 'No'}</dd>
          </dl>

          <div className={`checker__warning checker__warning--${result.severity}`} data-testid="checker-warning">
            {result.message}
          </div>

          <p className="disclaimer">
            Illustrative presentation based on expert feedback, not a live Canadian pesticide-label lookup.
          </p>
        </div>
      </div>
    </section>
  )
}
