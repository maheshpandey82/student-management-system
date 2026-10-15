import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  GraduationCap, LayoutDashboard, Users, BookOpen, Settings, Search,
  Plus, Pencil, Trash2, X, Menu, RefreshCw, UserRound, CircleCheck,
  AlertCircle, ChevronRight, Mail, SlidersHorizontal, ArrowUpRight
} from 'lucide-react'
import { api } from './api'

const emptyForm = { name: '', email: '', course: 'B.Tech', status: 'Active' }

function App() {
  const [page, setPage] = useState('Dashboard')
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [stats, setStats] = useState({ totalStudents: 0, activeStudents: 0, totalCourses: 0 })
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [studentData, courseData, statsData] = await Promise.all([
        api.students(search), api.courses(), api.stats()
      ])
      setStudents(studentData)
      setCourses(courseData)
      setStats(statsData)
    } catch (e) {
      setError(`${e.message}. Check that Spring Boot and MySQL are running.`)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { loadData() }, [loadData])
  useEffect(() => {
    if (!notice) return
    const id = setTimeout(() => setNotice(''), 3200)
    return () => clearTimeout(id)
  }, [notice])

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setModal(true)
  }
  const openEdit = (student) => {
    setEditing(student.id)
    setForm({ name: student.name, email: student.email, course: student.course, status: student.status || 'Active' })
    setModal(true)
  }
  const saveStudent = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editing) await api.updateStudent(editing, form)
      else await api.createStudent(form)
      setModal(false)
      setNotice(editing ? 'Student updated successfully.' : 'Student added successfully.')
      await loadData()
    } catch (e) {
      setError(e.message.includes('Request failed (500)') ? 'Could not save. Check whether this email already exists.' : e.message)
    } finally {
      setSaving(false)
    }
  }
  const removeStudent = async (student) => {
    if (!window.confirm(`Delete ${student.name}? This cannot be undone.`)) return
    try {
      await api.deleteStudent(student.id)
      setNotice('Student deleted.')
      await loadData()
    } catch (e) { setError(e.message) }
  }

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Students', icon: Users },
    { name: 'Courses', icon: BookOpen }
  ]
  const initials = (name = '') => name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
  const recentStudents = useMemo(() => [...students].slice(0, 5), [students])

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><GraduationCap size={25} /></div>
          <div><strong>Campus<span>Flow</span></strong><small>STUDENT PORTAL</small></div>
          <button className="icon-btn close-sidebar" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={19}/></button>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav className="nav-list">
          {navItems.map(item => {
            const Icon = item.icon
            return <button key={item.name} className={`nav-item ${page === item.name ? 'active' : ''}`} onClick={() => { setPage(item.name); setSidebarOpen(false) }}>
              <Icon size={18}/><span>{item.name}</span>{page === item.name && <ChevronRight className="nav-chevron" size={16}/>}
            </button>
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><CircleCheck size={18}/></div>
            <strong>Keep things organized</strong>
            <p>Your student records, all in one place.</p>
          </div>
          <div className="profile">
            <div className="avatar profile-avatar">MP</div>
            <div className="profile-text"><strong>Mahesh Pandey</strong><small>Administrator</small></div>
            <Settings size={17} className="profile-settings"/>
          </div>
        </div>
      </aside>

      {sidebarOpen && <button className="mobile-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"/>}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={21}/></button>
            <div className="breadcrumbs">Workspace <ChevronRight size={14}/> <strong>{page}</strong></div>
          </div>
          <div className="topbar-right"><span className="live-dot"/> <span className="system-status">System online</span><div className="avatar top-avatar">MP</div></div>
        </header>

        <div className="page-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">CAMPUS ADMINISTRATION</div>
              <h1>{page === 'Dashboard' ? 'Good day, Mahesh' : page + ' directory'}<span className="wave">{page === 'Dashboard' ? ' 👋' : ''}</span></h1>
              <p>{page === 'Dashboard' ? "Here's what's happening with your students today." : page === 'Students' ? 'Manage student profiles and academic information.' : 'Explore the courses available in your institution.'}</p>
            </div>
            <div className="heading-actions">
              <button className="btn btn-secondary" onClick={loadData}><RefreshCw size={16}/> Refresh</button>
              {page !== 'Courses' && <button className="btn btn-primary" onClick={openAdd}><Plus size={17}/> Add student</button>}
            </div>
          </div>

          {error && <div className="alert alert-error"><AlertCircle size={18}/><span>{error}</span><button className="alert-close" onClick={() => setError('')}><X size={16}/></button></div>}
          {notice && <div className="alert alert-success"><CircleCheck size={18}/><span>{notice}</span><button className="alert-close" onClick={() => setNotice('')}><X size={16}/></button></div>}

          {page !== 'Courses' && <section className="stats-grid">
            <StatCard title="Total students" value={stats.totalStudents} detail="All registered records" icon={<Users size={20}/>} tone="blue" />
            <StatCard title="Active students" value={stats.activeStudents} detail="Currently active" icon={<CircleCheck size={20}/>} tone="green" />
            <StatCard title="Courses represented" value={stats.totalCourses} detail="Across student records" icon={<BookOpen size={20}/>} tone="violet" />
            <StatCard title="Quick action" value="+" detail="Register a new student" icon={<UserRound size={20}/>} tone="amber" action={openAdd}/>
          </section>}

          {page === 'Dashboard' && <section className="content-grid">
            <div className="panel student-panel">
              <div className="panel-header">
                <div><h2>Recent students</h2><p>Your latest student records</p></div>
                <button className="text-link" onClick={() => setPage('Students')}>View all <ArrowUpRight size={15}/></button>
              </div>
              <StudentTable students={recentStudents} loading={loading} initials={initials} onEdit={openEdit} onDelete={removeStudent} compact/>
              <div className="panel-footer"><span>Showing {recentStudents.length} recent records</span><button className="footer-link" onClick={() => setPage('Students')}>Open directory <ChevronRight size={14}/></button></div>
            </div>
            <div className="panel side-panel">
              <div className="panel-header"><div><h2>Course overview</h2><p>Available study programs</p></div><div className="mini-icon"><BookOpen size={18}/></div></div>
              <div className="course-list">
                {courses.slice(0, 5).map((course, i) => <div className="course-row" key={course.code}>
                  <div className={`course-symbol symbol-${i % 4}`}>{course.code.slice(0, 1)}</div>
                  <div className="course-info"><strong>{course.code}</strong><span>{course.name}</span></div>
                  <span className="course-duration">{course.duration}</span>
                </div>)}
                {!courses.length && !loading && <p className="empty-inline">Course list unavailable.</p>}
              </div>
              <button className="wide-outline" onClick={() => setPage('Courses')}>Explore all courses <ChevronRight size={15}/></button>
            </div>
          </section>}

          {page === 'Students' && <section className="panel directory-panel">
            <div className="panel-header directory-header">
              <div><h2>All students</h2><p>{students.length} records found</p></div>
              <div className="search-tools">
                <div className="search-box"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or course..." aria-label="Search students"/>{search && <button onClick={() => setSearch('')} aria-label="Clear search"><X size={15}/></button>}</div>
                <span className="filter-chip"><SlidersHorizontal size={15}/> Live search</span>
              </div>
            </div>
            <StudentTable students={students} loading={loading} initials={initials} onEdit={openEdit} onDelete={removeStudent}/>
          </section>}

          {page === 'Courses' && <section className="course-cards">
            {courses.map((course, i) => <article className="course-card" key={course.code}>
              <div className={`course-card-icon symbol-${i % 4}`}><BookOpen size={23}/></div>
              <span className="course-tag">ACADEMIC PROGRAM</span>
              <h2>{course.code}</h2><p>{course.name}</p>
              <div className="course-card-footer"><span><BookOpen size={15}/> Duration</span><strong>{course.duration}</strong></div>
            </article>)}
            {!courses.length && !loading && <div className="panel empty-state">Could not load courses. Make sure the backend is running.</div>}
          </section>}

          <footer className="page-footer"><span>© 2026 CampusFlow Student Management</span><span>Built with React & Spring Boot <span className="footer-heart">♥</span></span></footer>
        </div>
      </main>

      {modal && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setModal(false) }}>
        <form className="student-modal" onSubmit={saveStudent}>
          <div className="modal-heading"><div><div className="modal-kicker">{editing ? 'UPDATE RECORD' : 'NEW RECORD'}</div><h2>{editing ? 'Edit student' : 'Add a student'}</h2><p>Enter the student details below.</p></div><button type="button" className="icon-btn" onClick={() => setModal(false)} aria-label="Close"><X size={20}/></button></div>
          <label>Full name<input autoFocus required minLength="2" value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="e.g. Rahul Sharma"/></label>
          <label>Email address<div className="input-with-icon"><Mail size={16}/><input type="email" required value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="rahul@example.com"/></div></label>
          <div className="form-row"><label>Course<select value={form.course} onChange={e => setForm({...form, course:e.target.value})}>{(courses.length ? courses.map(c => c.code) : ['B.Tech','BCA','B.Sc','MCA','MBA']).map(c => <option key={c}>{c}</option>)}</select></label><label>Status<select value={form.status} onChange={e => setForm({...form, status:e.target.value})}><option>Active</option><option>Inactive</option></select></label></div>
          <div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button><button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : <>{editing ? <Pencil size={16}/> : <Plus size={17}/>} {editing ? 'Save changes' : 'Create student'}</>}</button></div>
        </form>
      </div>}
    </div>
  )
}

function StatCard({ title, value, detail, icon, tone, action }) {
  return <div className={`stat-card tone-${tone}`}>
    <div className="stat-top"><span>{title}</span><div className="stat-icon">{icon}</div></div>
    <div className="stat-value-row"><strong>{value}</strong>{action && <button className="stat-add" onClick={action} aria-label="Add student"><Plus size={18}/></button>}</div>
    <div className="stat-detail">{detail}</div>
  </div>
}

function StudentTable({ students, loading, initials, onEdit, onDelete, compact = false }) {
  if (loading) return <div className="table-state"><RefreshCw className="spin" size={20}/> Loading student records...</div>
  if (!students.length) return <div className="table-state empty-table"><div className="empty-icon"><Users size={24}/></div><strong>No students found</strong><span>Add a student or try another search.</span></div>
  return <div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>EMAIL</th><th>COURSE</th><th>STATUS</th><th className="actions-head">ACTIONS</th></tr></thead><tbody>
    {students.map((student, i) => <tr key={student.id}>
      <td><div className="student-cell"><div className={`avatar student-avatar avatar-color-${i % 5}`}>{initials(student.name)}</div><div><strong>{student.name}</strong><small>STU-{String(student.id).padStart(4, '0')}</small></div></div></td>
      <td className="email-cell">{student.email}</td><td><span className="course-pill">{student.course}</span></td>
      <td><span className={`status-pill ${student.status === 'Active' ? 'status-active' : 'status-inactive'}`}><span/>{student.status || 'Active'}</span></td>
      <td><div className="row-actions"><button className="action-btn edit-action" onClick={() => onEdit(student)} aria-label={`Edit ${student.name}`} title="Edit"><Pencil size={15}/></button><button className="action-btn delete-action" onClick={() => onDelete(student)} aria-label={`Delete ${student.name}`} title="Delete"><Trash2 size={15}/></button></div></td>
    </tr>)}
  </tbody></table></div>
}

export default App
