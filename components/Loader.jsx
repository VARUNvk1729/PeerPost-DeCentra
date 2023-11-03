import Loading from "./icon/Loading";

export default function Loader() {
    return (
        <div className="fixed inset-0 bg-dark/60 backdrop-blur z-50 flex items-center justify-center">
            <Loading />
        </div>
    );
}