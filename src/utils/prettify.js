export default function prettify(text, capitalize) {
    let spaced = text.split("_").join(" ");

    if (capitalize) {
        return spaced
            .toLowerCase()
            .split(" ")
            .map(s => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" ");
    } else {
        return spaced;
    }
}
