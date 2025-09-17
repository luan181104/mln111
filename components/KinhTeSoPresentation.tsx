"use client"

import { useEffect, useState } from "react"

const sampleQuiz = [
  {
    id: 1,
    q: "Ví điện tử phổ biến buộc Nhà nước phải ban hành quy định nào?",
    options: ["Luật Giao dịch điện tử", "Luật Hôn nhân và Gia đình", "Luật Lao động", "Luật Di trú"],
    answerIndex: 0,
  },
  {
    id: 2,
    q: "Chiến lược chuyển đổi số có tác dụng chính là?",
    options: [
      "Hạn chế phát triển công nghệ",
      "Thúc đẩy hạ tầng công nghệ và dịch vụ số",
      "Xóa bỏ thương mại điện tử",
      "Tăng thuế tiêu dùng",
    ],
    answerIndex: 1,
  },
]

const initialPoll = {
  question: "Theo bạn, KTTT (pháp luật, chính sách) trong kinh tế số nên:",
  options: [
    { label: "Đi sau, phản ánh CSHT", votes: 0 },
    { label: "Đi trước, định hướng và thúc đẩy", votes: 0 },
    { label: "Cần cân bằng hai chiều", votes: 0 },
  ],
}

const STORAGE_KEYS = {
  POLL: "kt_presentation_poll",
  SURVEY: "kt_presentation_survey",
}

export default function KinhTeSoPresentation() {
  const [section, setSection] = useState("home")
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [poll, setPoll] = useState(initialPoll)
  const [voted, setVoted] = useState(false)
  const [survey, setSurvey] = useState({ "Mua online": 0, "Dùng ví điện tử": 0, "Chưa quen": 0 })
  const [showQA, setShowQA] = useState(false)
  const [questions, setQuestions] = useState([])
  const [aiUsageOpen, setAiUsageOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    if (typeof window !== "undefined") {
      const savedPoll = localStorage.getItem(STORAGE_KEYS.POLL)
      if (savedPoll) {
        setPoll(JSON.parse(savedPoll))
      }

      const savedSurvey = localStorage.getItem(STORAGE_KEYS.SURVEY)
      if (savedSurvey) {
        setSurvey(JSON.parse(savedSurvey))
      }
    }
  }, [])

  useEffect(() => {
    if (isClient && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.POLL, JSON.stringify(poll))
    }
  }, [poll, isClient])

  useEffect(() => {
    if (isClient && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.SURVEY, JSON.stringify(survey))
    }
  }, [survey, isClient])

  function handleQuizSelect(qid, optIndex) {
    setQuizAnswers((prev) => ({ ...prev, [qid]: optIndex }))
  }
  function submitQuiz() {
    const results = sampleQuiz.map((q) => ({
      id: q.id,
      correct: quizAnswers[q.id] === q.answerIndex,
    }))
    const correctCount = results.filter((r) => r.correct).length
    alert(`Bạn trả lời đúng ${correctCount} / ${sampleQuiz.length}`)
  }

  function votePoll(index) {
    if (voted) {
      alert("Bạn đã bình chọn rồi (demo).")
      return
    }
    setPoll((prev) => {
      const copy = { ...prev }
      copy.options = prev.options.map((o, i) => (i === index ? { ...o, votes: o.votes + 1 } : o))
      return copy
    })
    setVoted(true)
  }

  function submitSurvey(choice) {
    setSurvey((prev) => ({ ...prev, [choice]: (prev[choice] || 0) + 1 }))
  }

  function submitQuestion(text) {
    if (!text) return
    setQuestions((prev) => [...prev, { id: Date.now(), text }])
    setShowQA(false)
  }

  function resetData() {
    if (!confirm("Reset demo data?")) return
    if (isClient && typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.POLL)
      localStorage.removeItem(STORAGE_KEYS.SURVEY)
    }
    setPoll(initialPoll)
    setSurvey({ "Mua online": 0, "Dùng ví điện tử": 0, "Chưa quen": 0 })
    setVoted(false)
    setQuestions([])
    alert("Đã reset.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-foreground font-sans">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">KS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Kinh tế số</h1>
                <p className="text-sm text-slate-600">CSHT & KTTT</p>
              </div>
            </div>
            <div className="flex gap-2">
              {[
                { key: "home", label: "Trang chủ" },
                { key: "theory", label: "Lý thuyết" },
                { key: "analysis", label: "Phân tích" },
                { key: "student", label: "Tương tác" },
                { key: "conclude", label: "Kết luận" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setSection(item.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    section === item.key
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-700 hover:bg-white/50 hover:text-blue-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => setAiUsageOpen(true)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-white/50 hover:text-indigo-600 transition-all duration-300"
              >
                AI Usage
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12">
        {section === "home" && (
          <section className="min-h-screen flex items-center">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="animate-fade-in-up">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-subtle"></div>
                    Nghiên cứu học thuật
                  </div>
                  <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight text-balance">
                    Mối quan hệ{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      CSHT & KTTT
                    </span>{" "}
                    trong bối cảnh kinh tế số
                  </h1>
                  <p className="text-xl text-slate-600 mb-8 leading-relaxed text-pretty">
                    Khám phá mối quan hệ biện chứng giữa cơ sở hạ tầng và kiến trúc thượng tầng qua lăng kính của cuộc
                    cách mạng số đang diễn ra.
                  </p>
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-8 rounded-3xl border border-slate-200 mb-8">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Câu hỏi nghiên cứu</h3>
                    <p className="text-slate-700 italic text-pretty">
                      "Kiến trúc thượng tầng chỉ phản ánh cơ sở hạ tầng hay có thể đi trước, định hướng sự phát triển
                      trong bối cảnh kinh tế số?"
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => setSection("analysis")}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      Khám phá phân tích
                    </button>
                    <button
                      onClick={() => setSection("theory")}
                      className="px-8 py-4 bg-white text-slate-700 rounded-2xl font-semibold border border-slate-200 hover:bg-slate-50 transition-all duration-300"
                    >
                      Xem lý thuyết
                    </button>
                  </div>
                </div>

                <div className="animate-slide-in-right">
                  <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-200">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Trải nghiệm tương tác</h3>
                      <p className="text-slate-600">
                        Tham gia ngay trong buổi thuyết trình với các hoạt động tương tác trực tiếp
                      </p>
                    </div>
                    <div className="grid gap-3">
                      {[
                        { key: "quiz", label: "Quiz kiến thức", icon: "🧠", desc: "Kiểm tra hiểu biết" },
                        { key: "poll", label: "Bình chọn ý kiến", icon: "📊", desc: "Chia sẻ quan điểm" },
                        { key: "student", label: "Khảo sát sinh viên", icon: "👥", desc: "Dữ liệu thực tế" },
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => setSection(item.key)}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 text-left group"
                        >
                          <div className="text-2xl">{item.icon}</div>
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900 group-hover:text-blue-500 transition-colors">
                              {item.label}
                            </div>
                            <div className="text-sm text-slate-500">{item.desc}</div>
                          </div>
                          <svg
                            className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {section === "theory" && (
          <section className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Cơ sở lý thuyết</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Nền tảng triết học Mác-Lênin về mối quan hệ giữa cơ sở hạ tầng và kiến trúc thượng tầng
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 animate-slide-in-left">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Cơ sở hạ tầng (CSHT)</h3>
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Toàn bộ quan hệ sản xuất trong xã hội. Trong kinh tế số bao gồm: nền tảng công nghệ, Internet, sàn
                  thương mại điện tử, hệ thống logistics và fintech.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-slate-600">Thay đổi phương thức sản xuất và lưu thông hàng hóa</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-slate-600">Xuất hiện các hình thức lao động mới (seller, shipper, developer)</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 animate-slide-in-right">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Kiến trúc thượng tầng (KTTT)</h3>
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed">
                  Hệ thống chính trị, pháp luật, đạo đức, văn hóa. Trong kinh tế số: luật thương mại điện tử, chính sách
                  chuyển đổi số, đạo đức kinh doanh số.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-slate-600">KTTT phản ánh CSHT nhưng có tính độc lập tương đối</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-slate-600">KTTT có thể thúc đẩy hoặc kìm hãm sự phát triển của CSHT</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-3xl p-12 text-white animate-fade-in-up">
              <div className="text-center">
                <h4 className="text-3xl font-bold mb-6">Nguyên lý quan hệ biện chứng</h4>
                <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
                  Cơ sở hạ tầng quyết định kiến trúc thượng tầng, đồng thời kiến trúc thượng tầng tác động trở lại cơ sở
                  hạ tầng — mối quan hệ hai chiều, không đơn tuyến.
                </p>
              </div>
            </div>
          </section>
        )}

        {section === "analysis" && (
          <section className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Phân tích tình huống</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Khám phá mối quan hệ hai chiều trong bối cảnh kinh tế số Việt Nam
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200 animate-slide-in-left">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">CSHT → KTTT</h3>
                </div>
                <div className="space-y-4">
                  {[
                    "Thương mại điện tử phổ biến → Xuất hiện nhu cầu điều chỉnh pháp luật (TMĐT, an ninh mạng)",
                    "Ví điện tử, thanh toán số → Cần chính sách fintech và bảo mật dữ liệu",
                    "Giao hàng nhanh → Thay đổi đạo đức cạnh tranh, bảo vệ quyền lợi người tiêu dùng",
                    "Hành vi sinh viên: mua online, tiêu dùng 24/7 → Văn hóa tiêu dùng mới",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-2xl shadow-sm">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-slate-700 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-200 animate-slide-in-right">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 17l-5-5m0 0l5-5m-5 5h12"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">KTTT → CSHT</h3>
                </div>
                <div className="space-y-4">
                  {[
                    "Chiến lược chuyển đổi số quốc gia → Thúc đẩy hạ tầng công nghệ",
                    "Chính sách hỗ trợ startup → Khuyến khích đầu tư nền tảng số",
                    "Chuẩn mực đạo đức & pháp luật → Tạo niềm tin, mở rộng thị trường số",
                    "Văn hóa review & influencer marketing → Định hướng nhu cầu, thúc đẩy dịch vụ mới",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-2xl shadow-sm">
                      <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-slate-700 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 mb-8 animate-fade-in-up">
              <h4 className="text-2xl font-bold text-slate-900 mb-6 text-center">Timeline phát triển</h4>
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                <div className="space-y-8">
                  {[
                    { year: "2010s", event: "Thương mại điện tử phát triển ban đầu", color: "blue" },
                    { year: "2015", event: "Ví điện tử phổ biến, thanh toán không tiền mặt", color: "indigo" },
                    { year: "2020s", event: "Chiến lược chuyển đổi số, pháp luật bắt đầu cập nhật", color: "purple" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
                    >
                      <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8"}`}>
                        <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 rounded-2xl border border-slate-200">
                          <div className={`text-lg font-bold text-${item.color}-600 mb-2`}>{item.year}</div>
                          <p className="text-slate-700">{item.event}</p>
                        </div>
                      </div>
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-blue-500 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 animate-fade-in-up">
              {[
                { title: "Luật Giao dịch điện tử", color: "blue", icon: "⚖️" },
                { title: "Chiến lược chuyển đổi số", color: "indigo", icon: "🚀" },
                { title: "Quy định fintech & bảo mật", color: "purple", icon: "🔒" },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h4 className="font-bold text-lg">{item.title}</h4>
                  <p className="text-sm opacity-90 mt-2">Ví dụ thực tế</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {(section === "student" || section === "poll" || section === "quiz") && (
          <section className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Tương tác trực tiếp</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Tham gia ngay để tạo dữ liệu thực tế cho buổi thuyết trình
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 animate-slide-in-left">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-xl">👥</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Khảo sát sinh viên</h3>
                </div>
                <p className="text-slate-600 mb-6">
                  Chia sẻ trải nghiệm của bạn với kinh tế số để tạo dữ liệu minh họa thực tế
                </p>
                <div className="space-y-3 mb-6">
                  {["Mua online thường xuyên", "Dùng ví điện tử", "Chưa quen với công nghệ"].map((choice) => (
                    <button
                      key={choice}
                      onClick={() => submitSurvey(choice)}
                      className="w-full text-left px-6 py-4 rounded-2xl bg-slate-50 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 border border-slate-200 hover:border-green-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900 group-hover:text-green-600">{choice}</span>
                        <svg
                          className="w-5 h-5 text-slate-400 group-hover:text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-slate-50 to-green-50 p-6 rounded-2xl border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-3">Kết quả thời gian thực</h4>
                  <div className="space-y-2">
                    {Object.entries(survey).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between">
                        <span className="text-slate-700">{k}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.max(10, (v / Math.max(1, Math.max(...Object.values(survey)))) * 100)}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-slate-900 w-8">{v}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 animate-slide-in-right">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Bình chọn ý kiến</h3>
                </div>
                <p className="text-slate-700 mb-6 font-medium">{poll.question}</p>
                <div className="space-y-3 mb-6">
                  {poll.options.map((opt, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-900">{opt.label}</span>
                        <span className="text-sm text-slate-500">{opt.votes} phiếu</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.max(
                                5,
                                (opt.votes /
                                  Math.max(
                                    1,
                                    poll.options.reduce((sum, o) => sum + o.votes, 0),
                                  )) *
                                  100,
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <button
                          onClick={() => votePoll(idx)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          Vote
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-500 text-center">Dữ liệu được lưu tạm thời trong trình duyệt</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 animate-fade-in-up">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-xl">🧠</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Quiz kiến thức</h3>
                  <p className="text-slate-600">Kiểm tra nhanh để đảm bảo người nghe nắm được ý chính</p>
                </div>
              </div>

              <div className="space-y-6">
                {sampleQuiz.map((q, i) => (
                  <div
                    key={q.id}
                    className="bg-gradient-to-r from-slate-50 to-purple-50 rounded-2xl p-6 border border-slate-200"
                  >
                    <div className="font-semibold text-lg text-slate-900 mb-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full text-sm font-bold mr-3">
                        {i + 1}
                      </span>
                      {q.q}
                    </div>
                    <div className="grid gap-3">
                      {q.options.map((op, oi) => (
                        <label
                          key={oi}
                          className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                            quizAnswers[q.id] === oi
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                              : "bg-white hover:bg-purple-50 border border-slate-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q_${q.id}`}
                            checked={quizAnswers[q.id] === oi}
                            onChange={() => handleQuizSelect(q.id, oi)}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              quizAnswers[q.id] === oi ? "border-white" : "border-slate-300"
                            }`}
                          >
                            {quizAnswers[q.id] === oi && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                          <span className="font-medium">{op}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={submitQuiz}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Nộp bài quiz
                </button>
                <button
                  onClick={() => {
                    setQuizAnswers({})
                    setQuizIndex(0)
                  }}
                  className="px-8 py-4 bg-white text-slate-700 rounded-2xl font-semibold border border-slate-200 hover:bg-slate-50 transition-all duration-300"
                >
                  Làm lại
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center mt-12">
              <button
                onClick={() => setShowQA(true)}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                🙋‍♀️ Đặt câu hỏi Q&A
              </button>
              <button
                onClick={resetData}
                className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                🔄 Reset dữ liệu demo
              </button>
            </div>

            <div className="mt-12 bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
              <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="text-2xl">💬</span>
                Câu hỏi từ khán giả
              </h4>
              {questions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🤔</div>
                  <p className="text-slate-500">Chưa có câu hỏi nào. Hãy là người đầu tiên đặt câu hỏi!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((q) => (
                    <div
                      key={q.id}
                      className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-2xl border border-slate-200"
                    >
                      <p className="text-slate-700">{q.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {section === "conclude" && (
          <section className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Kết luận</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Tổng kết những phát hiện quan trọng từ nghiên cứu
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl p-12 text-white mb-12 animate-fade-in-up">
              <div className="max-w-4xl mx-auto text-center">
                <h3 className="text-3xl font-bold mb-6">Phát hiện chính</h3>
                <p className="text-xl text-blue-100 leading-relaxed mb-8">
                  Mối quan hệ giữa cơ sở hạ tầng và kiến trúc thượng tầng trong kinh tế số là
                  <span className="font-bold text-white"> mối quan hệ hai chiều, tương tác biện chứng</span>. CSHT là
                  lực đẩy trực tiếp, nhưng KTTT có thể đi trước, định hướng, thúc đẩy hoặc kìm hãm sự phát triển.
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full backdrop-blur-sm">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse-subtle"></div>
                  <span className="text-blue-200">Cần sự đồng bộ để phát triển bền vững</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 animate-slide-in-left">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-xl">🎓</span>
                </div>
                <h4 className="text-2xl font-bold text-slate-900">Bài học cho sinh viên</h4>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: "🔒",
                    title: "An toàn số",
                    desc: "Nâng cao hiểu biết về an toàn số và pháp luật liên quan",
                  },
                  {
                    icon: "🤝",
                    title: "Tham gia có trách nhiệm",
                    desc: "Đánh giá công bằng, phản hồi có trách nhiệm trong nền kinh tế số",
                  },
                  {
                    icon: "🚀",
                    title: "Phát triển kỹ năng",
                    desc: "Ứng dụng công nghệ để phát triển kỹ năng nghề nghiệp",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-slate-50 to-green-50 p-6 rounded-2xl border border-slate-200"
                  >
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <h5 className="font-bold text-slate-900 mb-2">{item.title}</h5>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <footer className="mt-24 bg-gradient-to-r from-slate-900 to-blue-900 text-white">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <span className="text-white font-bold text-xl">KS</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Kinh tế số — CSHT & KTTT</h3>
              <p className="text-blue-200 mb-6 max-w-2xl mx-auto">
                Website thuyết trình tương tác thay thế slide truyền thống • Nghiên cứu mối quan hệ biện chứng trong bối
                cảnh số hóa
              </p>
              <div className="flex justify-center gap-4 text-sm text-blue-300">
                <span>Team: [Tên nhóm]</span>
                <span>•</span>
                <span>Môn: Triết học Mác-Lênin</span>
                <span>•</span>
                <button onClick={() => setAiUsageOpen(true)} className="hover:text-white transition-colors underline">
                  AI Usage Report
                </button>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {aiUsageOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-xl">🤖</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">AI Usage Report</h3>
                    <p className="text-slate-600">Báo cáo minh bạch về việc sử dụng AI</p>
                  </div>
                </div>
                <button
                  onClick={() => setAiUsageOpen(false)}
                  className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-blue-600">🛠️</span>
                    Công cụ sử dụng
                  </h4>
                  <p className="text-slate-700">
                    <strong>ChatGPT (OpenAI)</strong> — Hỗ trợ soạn thảo nội dung, tạo quiz, cấu trúc website demo
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-green-600">🎯</span>
                    Mục đích sử dụng
                  </h4>
                  <p className="text-slate-700">
                    Hỗ trợ viết nháp, gợi ý cấu trúc, tạo mẫu quiz và poll.
                    <strong> Tất cả output đã được kiểm chứng và chỉnh sửa</strong> theo giáo trình LLCT.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-purple-600">💬</span>
                    Prompts chính
                  </h4>
                  <div className="bg-slate-900 p-4 rounded-xl">
                    <code className="text-green-400 text-sm">
                      "Soạn dàn ý thuyết trình về mối quan hệ giữa CSHT và KTTT trong bối cảnh kinh tế số. Tập trung vào
                      ví dụ TMĐT, fintech, chính sách chuyển đổi số..."
                    </code>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-amber-600">✅</span>
                    Kiểm chứng
                  </h4>
                  <p className="text-slate-700">
                    Đối chiếu với giáo trình Triết học Mác-Lênin và văn bản chính thức (Luật TMĐT, Chiến lược chuyển đổi
                    số quốc gia).
                  </p>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-200">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-red-600">🎓</span>
                    Cam kết liêm chính học thuật
                  </h4>
                  <p className="text-slate-700">
                    Nhóm cam kết AI chỉ hỗ trợ, không thay thế. Phần nội dung cuối cùng
                    <strong> do sinh viên biên soạn & kiểm chứng</strong> hoàn toàn.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <p className="text-sm text-slate-500 italic text-center">
                    📝 Ghi chú: Nhóm cần điền đầy đủ tool names, prompts, outputs và links tới nguồn chính thống trước
                    khi nộp bài.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showQA && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-xl">💬</span>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-900">Gửi câu hỏi</h4>
                  <p className="text-slate-600">Đặt câu hỏi cho nhóm thuyết trình</p>
                </div>
              </div>
              <QAForm onSubmit={submitQuestion} onClose={() => setShowQA(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function QAForm({ onSubmit, onClose }) {
  const [question, setQuestion] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (question.trim()) {
      onSubmit(question.trim())
      setQuestion("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-slate-700 mb-2">
          Câu hỏi của bạn
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Nhập câu hỏi bạn muốn đặt cho nhóm thuyết trình..."
          className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
          required
        />
      </div>
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 text-slate-600 hover:text-slate-800 transition-colors"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          Gửi câu hỏi
        </button>
      </div>
    </form>
  )
}
