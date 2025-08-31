"use client";
import { DIFFICULTIES, CATEGORIES } from "@/lib/questions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  filterDifficulty: string;
  setFilterDifficulty: (val: string) => void;
  filterCategory: string;
  setFilterCategory: (val: string) => void;
  newQ: string;
  setNewQ: (val: string) => void;
  newQCat: string;
  setNewQCat: (val: string) => void;
  newQDiff: string;
  setNewQDiff: (val: string) => void;
  handleAddCustomQ: (e: React.FormEvent) => void;
};

export default function CustomizationPanel({
  filterDifficulty,
  setFilterDifficulty,
  filterCategory,
  setFilterCategory,
  newQ,
  setNewQ,
  newQCat,
  setNewQCat,
  newQDiff,
  setNewQDiff,
  handleAddCustomQ,
}: Props) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Customize Your Practice</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="space-y-2">
            <Label>Difficulty:</Label>
            <Select
              value={filterDifficulty}
              onValueChange={setFilterDifficulty}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Category:</Label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <form onSubmit={handleAddCustomQ} className="space-y-3">
          <Label className="text-base font-semibold">
            Add Your Own Question
          </Label>
          <Input
            type="text"
            placeholder="e.g. Pitch yourself in 30 seconds"
            value={newQ}
            onChange={(e) => setNewQ(e.target.value)}
          />
          <div className="flex gap-2">
            <Select value={newQCat} onValueChange={setNewQCat}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={newQDiff} onValueChange={setNewQDiff}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" variant="secondary">
              + Add
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
