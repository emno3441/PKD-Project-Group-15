const [file, setFile] = useState<File | null>(null);
const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files)
        setFile(files[0])
}