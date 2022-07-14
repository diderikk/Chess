defmodule BackendWeb.HelloView do
  def render("hello.json", %{name: name}) do
    %{message: "Hello " <> name}
  end
end
