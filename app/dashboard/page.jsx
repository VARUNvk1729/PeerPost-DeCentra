"use client";
import "../../../../flow/config";
import * as fcl from "@onflow/fcl";
import { Tooltip } from "react-tooltip";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useUserStore, useWriteStore } from "../../../../utils/store";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { handleFileToIpfs, handleJsonToIpfs } from "../../../../utils/ipfs";
import { createPost } from "../../../../flow/transactions";
import Loader from "../../../../components/Loader";
import Tiptap from "../../../../components/tiptap/Tiptap";
import GetTitle from "../../../../components/ai/GetTitle";

registerPlugin(FilePondPluginImagePreview);

export default function Page() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const pondRef = useRef();
  const priceRef = useRef();
  const title = useWriteStore((state) => state.title);
  const description = useWriteStore((state) => state.description);
  const setTitle = useWriteStore((state) => state.setTitle);
  const setDescription = useWriteStore((state) => state.setDescription);
  const showModalTitle = useWriteStore((state) => state.showModalTitle);
  const setShowModalTitle = useWriteStore((state) => state.setShowModalTitle);
  const [thumbnail, setThumbnail] = useState();
  const [loading, setLoading] = useState(false);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    const wordsPerMinute = 200;
    let textLength = description.split(" ").length;
    if(description.length > 10){
      let value = Math.ceil(textLength / wordsPerMinute);
      setReadingTime(value);
    }
  }, [description]);

  if (!user?.loggedIn) {
    return router.push("/");
  }

  const handlePublish = async () => {
    toast.dismiss();
    if (title == "") {
      return toast.error("Title is required");
    }
    if (description == "") {
      return toast.error("Description is required");
    }
    if (priceRef?.current?.value < 0) {
      return toast.error("Min. price is 0");
    }
    if (!pondRef.current?.getFile()?.file) {
      return toast.error("Thumbnail is required");
    }

    setLoading(true);
    let ipfsContentHash = "";
    let ipfsThumbnailHash = "";

    try {
      const tThumb = toast.loading("Uploading thumbnail to IPFS...");
      ipfsThumbnailHash = await handleFileToIpfs(pondRef.current?.getFile()?.file, new Date().toTimeString());
      toast.dismiss(tThumb);
    } catch (err) {
      setLoading(false);
      console.log(err);
      return toast.error("Error occured!");
    }

    try {
      const tContent = toast.loading("Uploading article to IPFS...");
      ipfsContentHash = await handleJsonToIpfs(description, new Date().toTimeString());
      toast.dismiss(tContent);
    } catch (err) {
      setLoading(false);
      console.log(err);
      return toast.error("Error occured!");
    }

    try {
      const txId = await createPost(title, `https://ipfs.io/ipfs/${ipfsContentHash}`, `https://ipfs.io/ipfs/${ipfsThumbnailHash}`, parseInt(priceRef?.current?.value || 0).toFixed(2), readingTime);
      fcl.tx(txId).subscribe((e) => {
        if (e?.statusString != "") {
          toast.dismiss();
          toast.loading(e?.statusString);
        }
      });
      await fcl.tx(txId).onceSealed();
      toast.dismiss();

      setTitle("");
      setDescription("");
      toast.success("Published!");
      setLoading(false);
      setTimeout(() => {
        return router.push("/dashboard/article");
      }, 1000);
    } catch (err) {
      toast.dismiss();
      setLoading(false);
      console.log(err);
      return toast.error("Error occured!");
    }
  };

  return (
    <>
      {loading && <Loader />}
      <Tooltip id="my-tooltip" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="bg-white rounded-md shadow border p-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-danger-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  name="title"
                  value={title}
                  id="title"
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1 w-full border-gray-300 rounded"
                  placeholder="Title"
                />
                <button
                  onClick={() => setShowModalTitle(true)}
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Get title recommendations with AI"
                  className="shrink-0 bg-lime text-primary-800 border border-primary-100 p-2 rounded hover:border-primary-800 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 256 256">
                    <path
                      fill="currentColor"
                      d="M252 152a12 12 0 0 1-12 12h-12v12a12 12 0 0 1-24 0v-12h-12a12 12 0 0 1 0-24h12v-12a12 12 0 0 1 24 0v12h12a12 12 0 0 1 12 12ZM56 76h12v12a12 12 0 0 0 24 0V76h12a12 12 0 1 0 0-24H92V40a12 12 0 0 0-24 0v12H56a12 12 0 0 0 0 24Zm128 112h-4v-4a12 12 0 0 0-24 0v4h-4a12 12 0 0 0 0 24h4v4a12 12 0 0 0 24 0v-4h4a12 12 0 0 0 0-24Zm38.14-105.17L82.82 222.14a20 20 0 0 1-28.28 0l-20.69-20.68a20 20 0 0 1 0-28.29L173.17 33.86a20 20 0 0 1 28.28 0l20.69 20.68a20 20 0 0 1 0 28.29ZM159 112l-15-15l-90.35 90.31l15 15Zm43.31-43.31l-15-15L161 80l15 15Z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <label htmlFor="description" className="text-sm font-medium">
                  Description <span className="text-danger-500">*</span>
                </label>
                <span className="text-xs font-bold text-primary-800 bg-gray-100 px-1 py-1">~ {readingTime} min read</span>
              </div>
              <Tiptap />
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-md shadow border p-4 mb-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="price" className="text-sm font-medium">
                  Price <span className="text-danger-500">*</span>
                </label>
                <span className="text-xs font-semibold px-2 py-1 bg-lime rounded">in FLOW</span>
              </div>
              <input ref={priceRef} type="number" required name="price" id="price" className="w-full border-gray-300 rounded" placeholder="0" />
            </div>
            <div className="space-y-2">
              <label htmlFor="thumbnail" className="text-sm font-medium">
                Thumbnail <span className="text-danger-500">*</span>
              </label>
              <FilePond
                ref={pondRef}
                dropOnPage
                storeAsFile
                name="thumbnail"
                files={thumbnail}
                allowMultiple={false}
                onupdatefiles={setThumbnail}
                acceptedFileTypes="image/*"
              />
            </div>
          </div>
          <button
            onClick={() => handlePublish()}
            className="w-full flex items-center justify-center gap-2 font-bold text-sm text-lime bg-primary-800 px-4 py-3 rounded-md hover:shadow-lg hover:shadow-primary-800/20 hover:-translate-y-px transition-all hover:contrast-125"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 256 256">
              <path
                fill="currentColor"
                d="m234.8 89.9l-68.7-68.7a19.9 19.9 0 0 0-28.2 0l-24.5 24.5l-57.3 21.4a20.2 20.2 0 0 0-12.7 15.5L20.2 222A11.9 11.9 0 0 0 32 236l2-.2l139.4-23.2a20.2 20.2 0 0 0 15.5-12.7l21.4-57.2l24.5-24.6a19.9 19.9 0 0 0 0-28.2Zm-67.6 99.4L67 206l33.5-33.5a36 36 0 1 0-17-17L50 189L66.7 88.8L117 70l69.1 69ZM104 140a12 12 0 1 1 12 12a12 12 0 0 1-12-12Zm96-21l-63-63l15-15l63 63Z"
              />
            </svg>
            <span className="hidden md:block">Publish</span>
          </button>
        </div>
      </div>

      <Transition appear show={showModalTitle} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setShowModalTitle(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-bold">
                    Get Title Recommendations with AI
                  </Dialog.Title>
                  <hr className="my-4" />
                  <GetTitle />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
