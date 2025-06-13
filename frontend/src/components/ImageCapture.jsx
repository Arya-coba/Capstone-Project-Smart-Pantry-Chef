// frontend/src/components/ImageCapture.jsx

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useTranslation } from "react-i18next";

// URL untuk ML Service diambil dari environment variable
const ML_SERVICE_URL = import.meta.env.VITE_ML_SERVICE_URL;

// Fungsi helper untuk konversi data URL ke File
const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export default function ImageCapture({ onIngredientsDetected }) {
  const { t } = useTranslation();
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);

  // Memastikan permission kamera sebelum membuka tampilan kamera
  const ensureCamera = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setShowCamera(true);
      setError(null);
    } catch (err) {
      console.error("Webcam permission error:", err);
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setError(t("imageCapture.errorPermission"));
      } else if (
        err.name === "NotFoundError" ||
        err.name === "OverconstrainedError"
      ) {
        setError("Kamera tidak ditemukan. Pastikan perangkat memiliki kamera.");
      } else {
        setError("Tidak dapat mengakses kamera.");
      }
    }
  };

  const startCamera = () => ensureCamera();
  const stopCamera = () => {
    setShowCamera(false);
    setError(null);
  };

  // Fungsi untuk mendeteksi bahan dari gambar
  const detectIngredients = async (imageSrc) => {
    if (!imageSrc) return;

    setLoading(true);
    setError(null);

    try {
      // Konversi data URL ke File
      const file = dataURLtoFile(imageSrc, "capture.jpg");

      // Buat FormData untuk mengirim file
      const formData = new FormData();
      formData.append("image", file);

      // Kirim ke ML Service
      const response = await axios.post(ML_SERVICE_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("ML Service response:", response.data);

      if (response.data.success && response.data.ingredients) {
        onIngredientsDetected(response.data.ingredients);
      } else {
        throw new Error(response.data.error || "Gagal mendeteksi bahan");
      }

      return response.data;
    } catch (err) {
      console.error("Error detecting ingredients:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Terjadi kesalahan saat memproses gambar",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menangkap gambar dari kamera
  const captureImage = useCallback(() => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      stopCamera();
      detectIngredients(imageSrc);
    }
  }, [webcamRef]);

  // Fungsi untuk menangani upload file
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageSrc = reader.result;
      setCapturedImage(imageSrc);
      detectIngredients(imageSrc);
    };
    reader.readAsDataURL(file);
  };

  // Fungsi untuk mengklik input file secara programatik
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCapturedImage(reader.result);
    };
    reader.readAsDataURL(file);
    uploadImage(file);
  };

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  return (
    <div className="w-full space-y-4">
      {/* Tampilkan pesan error jika ada */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Preview Gambar */}
      <div className="relative w-full aspect-video bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4 flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-600">{t("imageCapture.detecting")}</p>
          </div>
        ) : capturedImage ? (
          <img
            src={capturedImage}
            alt={t("imageCapture.preview")}
            className="h-full w-full object-contain p-4"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <svg
              className="w-16 h-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-lg">{t("imageCapture.noImage")}</p>
            <p className="text-sm mt-2">{t("imageCapture.instructions")}</p>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
            <div className="text-xl font-medium">
              {t("imageCapture.detecting")}
            </div>
            <p className="text-sm opacity-80 mt-2">
              {t("imageCapture.pleaseWait")}
            </p>
          </div>
        )}
      </div>

      {/* Kamera */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-full object-cover"
              onUserMediaError={(err) => {
                console.error("Webcam error:", err);
                setError(t("imageCapture.errorPermission"));
                stopCamera();
              }}
            />

            {/* Cancel / close camera button */}
            <div className="absolute top-4 right-4 flex flex-col items-center space-y-1">
              <button
                onClick={stopCamera}
                className="bg-gray-800 hover:bg-gray-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors"
                title={t("imageCapture.cancel")}
                aria-label={t("imageCapture.cancel")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.225 4.811a1 1 0 011.414 0L12 9.172l4.361-4.361a1 1 0 111.414 1.414L13.414 10.586l4.361 4.361a1 1 0 01-1.414 1.414L12 12l-4.361 4.361a1 1 0 01-1.414-1.414l4.361-4.361-4.361-4.361a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <span className="text-xs text-white">{t("imageCapture.cancel")}</span>
            </div>

            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
              <button
                onClick={captureImage}
                className="bg-white hover:bg-gray-100 rounded-full p-2 shadow-xl transform active:scale-95 transition-transform"
                title={t("imageCapture.takePhoto")}
              >
                <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-500"></div>
                </div>
              </button>
            </div>

            <div className="absolute bottom-6 left-6 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
              {t("imageCapture.recording")}
            </div>
          </div>

          <p className="text-white text-center mt-6 max-w-md">
            {t("imageCapture.photoInstruction")}
          </p>
        </div>
      )}

      {/* Tombol Aksi */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={ensureCamera}
          disabled={loading}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 font-medium transition-colors ${
            loading
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white border-orange-500 text-orange-500 hover:bg-orange-50"
          }`}
        >
          <svg
            className={`h-5 w-5 ${loading ? "opacity-50" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>{t("imageCapture.takePhoto")}</span>
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={loading}
        />

        <button
          onClick={triggerFileInput}
          disabled={loading}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 font-medium transition-colors ${
            loading
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white border-orange-500 text-orange-500 hover:bg-orange-50"
          }`}
        >
          <svg
            className={`h-5 w-5 ${loading ? "opacity-50" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          <span>{t("imageCapture.upload")}</span>
        </button>
      </div>

      <p className="text-center text-gray-500 text-sm mt-4">
        {t("imageCapture.uploadPrompt")}
      </p>

      {/* Kamera */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-6xl h-[80vh] bg-black rounded-xl overflow-hidden">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-full object-cover"
              onUserMediaError={(err) => {
                console.error("Webcam error:", err);
                setError(t("imageCapture.errorPermission"));
                stopCamera();
              }}
            />

            {/* Cancel / close camera button */}
            <div className="absolute top-4 right-4 flex flex-col items-center space-y-1">
              <button
                onClick={stopCamera}
                className="bg-gray-800 hover:bg-gray-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors"
                title={t("imageCapture.cancel")}
                aria-label={t("imageCapture.cancel")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.225 4.811a1 1 0 011.414 0L12 9.172l4.361-4.361a1 1 0 111.414 1.414L13.414 10.586l4.361 4.361a1 1 0 01-1.414 1.414L12 12l-4.361 4.361a1 1 0 01-1.414-1.414l4.361-4.361-4.361-4.361a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <span className="text-xs text-white">{t("imageCapture.cancel")}</span>
            </div>

            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
              <button
                onClick={captureImage}
                className="bg-white hover:bg-gray-100 rounded-full p-2 shadow-xl transform active:scale-95 transition-transform"
                title={t("imageCapture.takePhoto")}
              >
                <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-500"></div>
                </div>
              </button>
            </div>

            <div className="absolute bottom-6 left-6 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
              {t("imageCapture.recording")}
            </div>
          </div>

          <p className="text-white text-center mt-6 max-w-md">
            {t("imageCapture.photoInstruction")}
          </p>
        </div>
      )}
    </div>
  );
}
