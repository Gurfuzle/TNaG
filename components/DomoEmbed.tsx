interface DomoEmbedProps {
  url: string;
  height?: number;
}

export default function DomoEmbed({ url, height = 1200 }: DomoEmbedProps) {
  return (
    <div className="domo-embed">
      <iframe
        src={url}
        width="100%"
        height={height}
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
}
