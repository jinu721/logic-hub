import { useEffect, useRef, useState } from "react"
import { Play, Pause, X, Send, PlayCircle } from "lucide-react"
import { formatTime } from "@/utils/date.format"

type Props = {
    handleUploadFile: (file: File | Blob, type: "audio") => void
    onClose:()=>void
}

const AudioRecorder = ({handleUploadFile,onClose}:Props) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)


  useEffect(()=>{
    handleStartRecording();
  },[])

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        const audioUrl = URL.createObjectURL(audioBlob)
        setAudioBlob(audioBlob)
        setAudioUrl(audioUrl)
      }

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

      mediaRecorder.start(200)
      setIsRecording(true)
      setIsPaused(false)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Cannot access your microphone. Please check permissions.")
    }
  }

  const handlePauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      if (mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.pause()
        clearInterval(timerRef.current!)
        setIsPaused(true)

        const currentBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        const currentUrl = URL.createObjectURL(currentBlob)
        setAudioUrl(currentUrl)
      }
    }
  }

  const handleResumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      if (mediaRecorderRef.current.state === "paused") {
        mediaRecorderRef.current.resume()
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1)
        }, 1000)
        setIsPaused(false)

        if (audioRef.current) {
          audioRef.current.pause()
          setIsPlaying(false)
        }
      }
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop()
        clearInterval(timerRef.current!)

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
        }

        setIsRecording(false)
        setIsPaused(false)
      }
    }
  }

  const handleCancelRecording = () => {
    handleStopRecording()
    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingTime(0)
    onClose()
    audioChunksRef.current = []
  }

  const handleSendAudio = async () => {
    handleStopRecording()
      onClose()

    if (audioBlob) {
      console.log("Audio blob ready to send 1:", audioBlob)
      await handleUploadFile(audioBlob, "audio")
    } else if (audioChunksRef.current.length > 0) {
      const finalBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
      console.log("Audio blob ready to send 2:", finalBlob)
      await handleUploadFile(finalBlob, "audio")
    }


    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingTime(0)
    audioChunksRef.current = []
  }

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }


  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto space-y-4">
      {audioUrl && <audio ref={audioRef} src={audioUrl} />}
      <div className="flex flex-col w-full space-y-4">
        <div className="flex items-center bg-gray-700 rounded-lg p-3 justify-between">
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-3 ${
                isPaused ? "bg-yellow-500" : isRecording ? "bg-red-500 animate-pulse" : "bg-gray-400"
              }`}
            ></div>
            <span className="text-gray-300">
              {isRecording
                ? isPaused
                  ? "Paused"
                  : `Recording... ${formatTime(recordingTime)}`
                : "Not recording"}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {isRecording &&
              (isPaused ? (
                <button
                  onClick={handleResumeRecording}
                  className="p-2 rounded-full bg-yellow-600 hover:bg-yellow-500 text-white"
                >
                  <Play size={18} />
                </button>
              ) : (
                <button
                  onClick={handlePauseRecording}
                  className="p-2 rounded-full bg-yellow-600 hover:bg-yellow-500 text-white"
                >
                  <Pause size={18} />
                </button>
              ))}
            {isRecording && (
              <>
                <button
                  onClick={handleCancelRecording}
                  className="p-2 rounded-full bg-gray-600 hover:bg-gray-500 text-white"
                >
                  <X size={18} />
                </button>
                <button
                  onClick={handleSendAudio}
                  className="p-2 rounded-full bg-green-600 hover:bg-green-500 text-white"
                >
                  <Send size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        {isPaused && audioUrl && (
          <div className="flex items-center justify-between bg-gray-200 p-2 rounded-lg">
            <span className="text-sm text-gray-700">Preview audio</span>
            <button
              onClick={togglePlayback}
              className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white"
            >
              {isPlaying ? <Pause size={18} /> : <PlayCircle size={18} />}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AudioRecorder
