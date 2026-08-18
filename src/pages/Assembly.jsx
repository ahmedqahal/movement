import AssemblyWalkthrough from '../components/AssemblyWalkthrough.jsx'

export default function Assembly() {
  return (
    <main className="content">
      <div className="page-head">
        <div className="page-head__eyebrow">Assembly Walkthrough</div>
        <h1>Build the movement, step by step</h1>
        <p>
          Follow a mechanical movement come together in reassembly order — each part drops into
          place as you advance. Step through with the controls (or the ← → arrow keys); the last
          step brings the escapement to life.
        </p>
      </div>
      <AssemblyWalkthrough />
    </main>
  )
}
