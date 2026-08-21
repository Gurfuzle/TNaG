interface DomoEmbedProps {
  url: string;
  title: string;
  height?: number;
}

export default function DomoEmbed({ url, title, height = 1200 }: DomoEmbedProps) {
  return (
    <div className="domo-embed">
      <iframe
        src={url}
        title={title}
        width="100%"
        height={height}
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
}
